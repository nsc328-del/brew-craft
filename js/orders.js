var CUSTOMER_NAMES_EN = [
  'ALEX','SAM','JORDAN','CASEY','RILEY','MORGAN','TAYLOR','DREW',
  'AVERY','QUINN','BLAKE','SAGE','SKYLER','ROBIN','JAMIE','PAT',
  'LOGAN','PARKER','REESE','DALLAS','EMERY','FINLEY','HARPER','ROWAN'
];

var CUSTOMER_NAMES_ZH = [
  '小明','小红','阿伟','子涵','梓萱','晓薇','晨阳','昊然',
  '思琪','婉清','嘉怡','静怡','志强','建国','海燕','美玲',
  '星辰','若汐','沐辰','一诺','子轩','可昕','思源','宇航'
];

var PERSONALITIES = {
  regular:  { weight: 50, patienceMod: 1.0, tipMod: 1.0,  commentKey: 'comment_regular' },
  hurry:    { weight: 18, patienceMod: 0.55, tipMod: 1.6,  commentKey: 'comment_hurry' },
  vip:      { weight: 12, patienceMod: 0.85, tipMod: 2.2,  commentKey: 'comment_vip' },
  friendly: { weight: 20, patienceMod: 1.4, tipMod: 1.2,  commentKey: 'comment_friendly' }
};

var nextOrderId = 1;

function getCustomerName() {
  var arr = (Lang === 'zh') ? CUSTOMER_NAMES_ZH : CUSTOMER_NAMES_EN;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickPersonality(day) {
  // VIPs and hurry types appear more often on later days
  var keys = Object.keys(PERSONALITIES);
  var weights = [];
  for (var i = 0; i < keys.length; i++) {
    var w = PERSONALITIES[keys[i]].weight;
    if (keys[i] === 'vip' || keys[i] === 'hurry') w += day * 2;
    weights.push(w);
  }
  var total = 0;
  for (var j = 0; j < weights.length; j++) total += weights[j];
  var roll = Math.random() * total;
  var cum = 0;
  for (var k = 0; k < keys.length; k++) {
    cum += weights[k];
    if (roll <= cum) return keys[k];
  }
  return 'regular';
}

function generateCustomer(day) {
  var personality = pickPersonality(day);
  var pData = PERSONALITIES[personality];
  var spriteType = Math.floor(Math.random() * 8);
  var basePatienceFrames = 900;
  var reduction = Math.min(day * 30, 400);
  var patience = (basePatienceFrames - reduction) * pData.patienceMod;
  if (GameState.rushHour) patience *= 0.7;

  return {
    name: getCustomerName(),
    spriteType: spriteType,
    patience: 100,
    patienceRate: 100 / Math.max(60, patience),
    personality: personality,
    tipMod: pData.tipMod
  };
}

function generateOrder() {
  var available = GameState.unlockedDrinks.slice();
  var weights = [];
  for (var i = 0; i < available.length; i++) {
    var r = RECIPES[available[i]];
    weights.push(r ? r.difficulty : 1);
  }

  var totalW = 0;
  for (var j = 0; j < weights.length; j++) totalW += weights[j];
  var roll = Math.random() * totalW;
  var cumulative = 0;
  var chosen = available[0];
  for (var k = 0; k < available.length; k++) {
    cumulative += weights[k];
    if (roll <= cumulative) { chosen = available[k]; break; }
  }

  return {
    id: nextOrderId++,
    drink: chosen,
    customer: generateCustomer(GameState.day),
    status: 'waiting'
  };
}

function updateOrders() {
  for (var i = GameState.currentOrders.length - 1; i >= 0; i--) {
    var order = GameState.currentOrders[i];
    if (order.status !== 'waiting') continue;

    order.customer.patience -= order.customer.patienceRate;

    if (order.customer.patience <= 0) {
      order.customer.patience = 0;
      order.status = 'failed';
      GameState.dayStats.failed++;
      GameState.reputation = Math.max(0, GameState.reputation - 8);
      GameState.score = Math.max(0, GameState.score - 20);
      GameState.streak = 0;
      addFloatingText(GAME_W / 2, 40, t('customer_left'), PALETTE.uiDanger);

      if (GameState.selectedOrder === i) GameState.selectedOrder = -1;

      (function(idx) {
        setTimeout(function() {
          GameState.currentOrders.splice(idx, 1);
          if (GameState.selectedOrder > idx) GameState.selectedOrder--;
          if (GameState.selectedOrder >= GameState.currentOrders.length) GameState.selectedOrder = -1;
        }, 500);
      })(i);
    }
  }

  var activeCount = 0;
  for (var j = 0; j < GameState.currentOrders.length; j++) {
    if (GameState.currentOrders[j].status === 'waiting') activeCount++;
  }

  var maxSimultaneous = Math.min(1 + Math.floor(GameState.day / 2), 3);
  if (GameState.rushHour) maxSimultaneous = Math.min(maxSimultaneous + 1, 3);

  if (activeCount < maxSimultaneous && GameState.customersSpawned < GameState.customersTarget) {
    GameState.spawnTimer++;
    var spawnInterval = Math.max(60, 180 - GameState.day * 15);
    if (GameState.rushHour) spawnInterval = Math.max(40, Math.floor(spawnInterval * 0.6));
    if (GameState.spawnTimer >= spawnInterval || GameState.currentOrders.length === 0) {
      GameState.spawnTimer = 0;
      GameState.currentOrders.push(generateOrder());
      GameState.customersSpawned++;
      GameState.dayStats.totalCustomers++;
      playSound('click');
    }
  }
}

function serveDrink() {
  var cup = GameState.workspace.cup;
  if (!cup || cup.contents.length === 0) {
    addFloatingText(GAME_W / 2, 130, t('cup_empty'), PALETTE.uiDanger);
    return;
  }
  if (GameState.selectedOrder < 0 || GameState.selectedOrder >= GameState.currentOrders.length) {
    addFloatingText(GAME_W / 2, 130, t('select_order'), PALETTE.uiDanger);
    return;
  }

  var order = GameState.currentOrders[GameState.selectedOrder];
  if (order.status !== 'waiting') return;

  var result = validateDrink(cup.contents, order.drink);
  var recipe = RECIPES[order.drink];
  var earnings = 0;
  var tips = 0;
  var tipMod = order.customer.tipMod || 1.0;
  var streakBonus = 0;
  var pickyFail = false;

  // VIP requires near-perfect; otherwise treat as wrong
  if (order.customer.personality === 'vip' && !result.perfect) {
    pickyFail = true;
  }

  if (result.perfect && !pickyFail) {
    earnings = recipe.price;
    tips = Math.ceil(recipe.price * 0.5 * tipMod);
    GameState.reputation = Math.min(100, GameState.reputation + 3);
    GameState.dayStats.perfect++;
    GameState.streak++;
    if (GameState.streak > GameState.dayStats.bestStreak) GameState.dayStats.bestStreak = GameState.streak;
    streakBonus = Math.min(GameState.streak - 1, 5);
    earnings += streakBonus;
    addFloatingText(GAME_W / 2, 80, t('perfect'), PALETTE.uiHighlight);
    if (GameState.streak >= 2) {
      addFloatingText(GAME_W / 2, 95, t('streak_text') + GameState.streak, PALETTE.uiHighlight);
    }
    playSound('perfect');
  } else if (result.score >= 70 && !pickyFail) {
    earnings = recipe.price;
    tips = Math.ceil(recipe.price * 0.2 * tipMod);
    GameState.reputation = Math.min(100, GameState.reputation + 1);
    GameState.streak = 0;
    addFloatingText(GAME_W / 2, 80, t('good') + ' +$' + (earnings + tips), PALETTE.uiSuccess);
    playSound('serve');
  } else if (result.score >= 40 && !pickyFail) {
    earnings = Math.ceil(recipe.price * 0.75);
    GameState.streak = 0;
    addFloatingText(GAME_W / 2, 80, t('ok') + ' $' + earnings, PALETTE.uiText);
    playSound('serve');
  } else {
    earnings = Math.ceil(recipe.price * 0.25);
    GameState.reputation = Math.max(0, GameState.reputation - 5);
    GameState.streak = 0;
    addFloatingText(GAME_W / 2, 80, t('wrong'), PALETTE.uiDanger);
    playSound('fail');
  }

  GameState.money += earnings + tips;
  GameState.score += Math.floor(result.score * (recipe.difficulty || 1));
  GameState.dayStats.served++;
  GameState.dayStats.earnings += earnings;
  GameState.dayStats.tips += tips;

  order.status = 'served';
  GameState.currentOrders.splice(GameState.selectedOrder, 1);
  GameState.selectedOrder = -1;
  GameState.workspace.cup = null;

  checkDayEnd();
}

function trashCup() {
  if (GameState.workspace.cup) {
    GameState.workspace.cup = null;
    GameState.workspace.processing = false;
    addFloatingText(GAME_W / 2, 130, t('trashed'), PALETTE.uiDanger);
    playSound('fail');
  }
}

function addFloatingText(x, y, text, color) {
  // Spread out vertically if other texts are nearby
  var offset = 0;
  for (var i = 0; i < GameState.floatingTexts.length; i++) {
    if (Math.abs(GameState.floatingTexts[i].x - x) < 60 && Math.abs(GameState.floatingTexts[i].y - y) < 12) {
      offset += 12;
    }
  }
  GameState.floatingTexts.push({
    x: x, y: y + offset, text: text, color: color, life: 70
  });
}

function updateFloatingTexts() {
  for (var i = GameState.floatingTexts.length - 1; i >= 0; i--) {
    GameState.floatingTexts[i].y -= 0.5;
    GameState.floatingTexts[i].life--;
    if (GameState.floatingTexts[i].life <= 0) {
      GameState.floatingTexts.splice(i, 1);
    }
  }
}

function checkDayEnd() {
  if (GameState.dayStats.served + GameState.dayStats.failed >= GameState.customersTarget) {
    var allDone = true;
    for (var i = 0; i < GameState.currentOrders.length; i++) {
      if (GameState.currentOrders[i].status === 'waiting') { allDone = false; break; }
    }
    if (allDone && GameState.customersSpawned >= GameState.customersTarget) {
      endDay();
    }
  }
}
