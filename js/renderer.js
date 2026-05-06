// ---- Scene Rendering ----

function renderPlaying(ctx) {
  drawBackground(ctx);
  drawCounter(ctx);
  drawEquipment(ctx);
  drawWorkspaceCup(ctx);
  drawOrderArea(ctx);
  drawIngredientBar(ctx);
  drawStatusBar(ctx);
  drawProcessingBar(ctx);
  drawLangButton(ctx);
  drawRushHourBanner(ctx);
  drawStreakIndicator(ctx);
  renderFloatingTexts(ctx);
}

// ---- Background ----
function drawBackground(ctx) {
  for (var y = 0; y < 80; y++) {
    var t2 = y / 80;
    var r = Math.floor(139 * (1 - t2) + 107 * t2);
    var g = Math.floor(115 * (1 - t2) + 85 * t2);
    var b = Math.floor(85 * (1 - t2) + 53 * t2);
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.fillRect(0, y, GAME_W, 1);
  }

  rect(ctx, 10, 15, 300, 3, PALETTE.woodDark);
  rect(ctx, 10, 13, 300, 2, PALETTE.woodMid);
}

// ---- Counter ----
function drawCounter(ctx) {
  ctx.fillStyle = PALETTE.woodLight;
  ctx.beginPath();
  ctx.moveTo(20, 100);
  ctx.lineTo(300, 100);
  ctx.lineTo(310, 90);
  ctx.lineTo(10, 90);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = PALETTE.woodMid;
  ctx.beginPath();
  ctx.moveTo(5, 168);
  ctx.lineTo(315, 168);
  ctx.lineTo(300, 100);
  ctx.lineTo(20, 100);
  ctx.closePath();
  ctx.fill();

  for (var y = 108; y < 168; y += 10) {
    var inset = (y - 100) * 0.22;
    rect(ctx, Math.floor(20 - inset), y, Math.floor(280 + inset * 2), 1, PALETTE.woodDark);
  }

  rect(ctx, 20, 100, 280, 1, PALETTE.woodLight);
  rect(ctx, 5, 168, 310, 2, PALETTE.woodShadow);
}

// ---- Equipment ----
function drawEquipment(ctx) {
  var machineX = 30, machineY = 52;
  ctx.drawImage(SpriteCache.espresso_machine, machineX, machineY);

  if (GameState.workspace.processing &&
      GameState.workspace.processIngredient === 'espresso_shot') {
    var sf = SpriteCache.steam[GameState.steamFrame];
    ctx.drawImage(sf, machineX + 18, machineY - 4);
    ctx.drawImage(sf, machineX + 22, machineY - 6);
  }

  var steamerX = 258, steamerY = 76;
  ctx.drawImage(SpriteCache.steamer, steamerX, steamerY);

  if (GameState.workspace.processing &&
      (GameState.workspace.processIngredient === 'steamed_milk' ||
       GameState.workspace.processIngredient === 'milk_foam')) {
    var sf2 = SpriteCache.steam[GameState.steamFrame];
    ctx.drawImage(sf2, steamerX + 6, steamerY - 5);
    ctx.drawImage(sf2, steamerX + 10, steamerY - 7);
  }

  rect(ctx, 240, 80, 4, 12, PALETTE.metalMid);
  rect(ctx, 238, 80, 8, 3, PALETTE.metalDark);
  rect(ctx, 240, 92, 4, 2, PALETTE.metalLight);
}

// ---- Workspace Cup ----
function drawWorkspaceCup(ctx) {
  var cup = GameState.workspace.cup;
  if (!cup) {
    drawTextLocCentered(ctx, t('click_cup'), 160, 130, PALETTE.cupShadow, 1);
    return;
  }

  var cupSprite = SpriteCache['cup_' + cup.size];
  if (!cupSprite) return;

  var scale = 2;
  var cx = 145, cy = 100;
  var cw = cupSprite.width * scale, ch = cupSprite.height * scale;

  ctx.drawImage(cupSprite, cx, cy, cw, ch);

  if (cup.contents.length > 0) {
    var bodyTop, bodyH, bodyLeft, bodyW;
    if (cup.size === 'small') { bodyTop = cy + 4 * scale; bodyH = 7 * scale; bodyLeft = cx + 3 * scale; bodyW = 6 * scale; }
    else if (cup.size === 'medium') { bodyTop = cy + 4 * scale; bodyH = 9 * scale; bodyLeft = cx + 3 * scale; bodyW = 8 * scale; }
    else { bodyTop = cy + 4 * scale; bodyH = 11 * scale; bodyLeft = cx + 3 * scale; bodyW = 10 * scale; }

    var bandH = Math.max(2, Math.floor(bodyH / Math.max(cup.contents.length, 1)));
    var by = bodyTop + bodyH;
    for (var i = 0; i < cup.contents.length; i++) {
      by -= bandH;
      var ing = INGREDIENTS[cup.contents[i]];
      if (ing) {
        rect(ctx, bodyLeft, by, bodyW, bandH, ing.color);
      }
    }
  }
}

// ---- Order Area ----
function drawOrderArea(ctx) {
  var orders = GameState.currentOrders;
  var slotW = 100;
  var startX = Math.floor((GAME_W - Math.min(orders.length, 3) * slotW) / 2);

  for (var i = 0; i < orders.length && i < 3; i++) {
    var order = orders[i];
    if (order.status !== 'waiting') continue;

    var ox = startX + i * slotW;
    var oy = 2;
    var w = slotW - 4;

    var selected = GameState.selectedOrder === i;
    rect(ctx, ox, oy, w, 64, selected ? PALETTE.uiBgLight : PALETTE.uiBg);
    rect(ctx, ox, oy, w, 1, selected ? PALETTE.uiHighlight : PALETTE.uiBorder);
    rect(ctx, ox, oy + 63, w, 1, PALETTE.uiBorder);
    rect(ctx, ox, oy, 1, 64, PALETTE.uiBorder);
    rect(ctx, ox + w - 1, oy, 1, 64, PALETTE.uiBorder);

    var custSprite = order.customer.patience > 25
      ? SpriteCache.customers[order.customer.spriteType % 8]
      : SpriteCache.customers_angry[order.customer.spriteType % 8];
    if (custSprite) {
      ctx.drawImage(custSprite, ox + 4, oy + 4);
    }

    // Personality icon (top-right corner of card)
    var pers = order.customer.personality || 'regular';
    if (pers !== 'regular' && SpriteCache.pers[pers]) {
      ctx.drawImage(SpriteCache.pers[pers], ox + w - 13, oy + 3);
    }

    var recipe = RECIPES[order.drink];
    if (recipe) {
      var drinkText = t(recipe.nameKey || 'drink_' + order.drink);
      drawTextLoc(ctx, drinkText, ox + 30, oy + 4, PALETTE.uiText, 1);
      drawText(ctx, '$' + recipe.price, ox + 30, oy + 18, PALETTE.uiHighlight, 1);
    }

    drawTextLoc(ctx, order.customer.name, ox + 30, oy + 30, PALETTE.cream, 1);

    var pData = PERSONALITIES[pers];
    if (pData) {
      drawTextLoc(ctx, t(pData.commentKey), ox + 4, oy + 44, PALETTE.cupShadow, 1);
    }

    var barW = w - 8;
    var barX = ox + 4;
    var barY = oy + 58;
    rect(ctx, barX, barY, barW, 5, PALETTE.metalDark);
    var patienceW = Math.floor(barW * order.customer.patience / 100);
    var barColor = order.customer.patience > 60 ? PALETTE.uiSuccess :
                   order.customer.patience > 30 ? PALETTE.uiHighlight : PALETTE.uiDanger;
    rect(ctx, barX, barY, patienceW, 5, barColor);
  }

  if (orders.length === 0) {
    drawTextLocCentered(ctx, t('waiting'), GAME_W / 2, 30, PALETTE.cupShadow, 1);
  }
}

// ---- Ingredient Bar ----
var IBAR_ITEMS = ['new_cup', 'espresso_shot', 'hot_water', 'steamed_milk', 'milk_foam', 'chocolate_syrup', 'whipped_cream', 'caramel_syrup'];
var IBAR_Y = 166;
var IBAR_SLOT_W = 28;
var IBAR_SLOT_H = 30;
var IBAR_GAP = 2;

function getIBarStartX() {
  var totalW = IBAR_ITEMS.length * IBAR_SLOT_W + (IBAR_ITEMS.length - 1) * IBAR_GAP;
  // Reserve room on right for serve/trash buttons (40px)
  var leftPad = Math.floor((GAME_W - totalW - 46) / 2);
  return Math.max(2, leftPad);
}

function getLabelForType(type) {
  if (type === 'new_cup') return t('cup_label');
  var ing = INGREDIENTS[type];
  return ing ? t(ing.nameKey) : '';
}

function drawIngredientBar(ctx) {
  var startX = getIBarStartX();

  for (var i = 0; i < IBAR_ITEMS.length; i++) {
    var ix = startX + i * (IBAR_SLOT_W + IBAR_GAP);
    var iy = IBAR_Y;
    var type = IBAR_ITEMS[i];

    rect(ctx, ix, iy, IBAR_SLOT_W, IBAR_SLOT_H, PALETTE.uiBg);
    rect(ctx, ix, iy, IBAR_SLOT_W, 1, PALETTE.uiBorder);
    rect(ctx, ix, iy + IBAR_SLOT_H - 1, IBAR_SLOT_W, 1, PALETTE.uiBorder);
    rect(ctx, ix, iy, 1, IBAR_SLOT_H, PALETTE.uiBorder);
    rect(ctx, ix + IBAR_SLOT_W - 1, iy, 1, IBAR_SLOT_H, PALETTE.uiBorder);

    var icon = SpriteCache.icons[type];
    if (icon) {
      ctx.drawImage(icon, ix + Math.floor((IBAR_SLOT_W - 16) / 2), iy + 1);
    }

    var label = getLabelForType(type);
    // Chinese (Zpix 12px) needs more vertical room than bitmap font (7px)
    var labelY = containsChinese(label) ? iy + 17 : iy + 22;
    drawTextLocCentered(ctx, label, ix + IBAR_SLOT_W / 2, labelY, PALETTE.cream, 1);
  }

  // Serve and Trash buttons (Chinese needs more height for 12px font)
  var btnX = startX + IBAR_ITEMS.length * (IBAR_SLOT_W + IBAR_GAP) + 4;
  var btnH = Lang === 'zh' ? 14 : 13;
  var textY = Lang === 'zh' ? 1 : 3;
  rect(ctx, btnX, IBAR_Y, 36, btnH, PALETTE.uiSuccess);
  drawTextLocCentered(ctx, t('serve'), btnX + 18, IBAR_Y + textY, '#ffffff', 1);
  rect(ctx, btnX, IBAR_Y + btnH + 1, 36, btnH, PALETTE.uiDanger);
  drawTextLocCentered(ctx, t('trash'), btnX + 18, IBAR_Y + btnH + 1 + textY, '#ffffff', 1);
}

// ---- Status Bar ----
function drawStatusBar(ctx) {
  var barH = 26;
  var y = GAME_H - barH;
  rect(ctx, 0, y, GAME_W, barH, PALETTE.uiBg);
  rect(ctx, 0, y, GAME_W, 1, PALETTE.uiBorder);

  var line2Y = y + 14;

  drawTextLoc(ctx, t('day') + ' ' + GameState.day, 4, y + 3, PALETTE.uiText, 1);
  drawText(ctx, '$' + GameState.money, 4, line2Y, PALETTE.uiHighlight, 1);

  drawTextLoc(ctx, t('score') + ' ' + GameState.score, 70, y + 3, PALETTE.uiText, 1);
  var served = GameState.dayStats.served + '/' + GameState.customersTarget;
  drawTextLoc(ctx, t('served') + ' ' + served, 70, line2Y, PALETTE.uiText, 1);

  var stars = Math.ceil(GameState.reputation / 20);
  var starX = 178;
  for (var i = 0; i < 5; i++) {
    var sprite = i < stars ? SpriteCache.star_filled : SpriteCache.star_empty;
    ctx.drawImage(sprite, starX + i * 9, y + 4);
  }
  drawTextLoc(ctx, t('rep'), 178, line2Y, PALETTE.cream, 1);

  var streakColor = GameState.streak >= 2 ? PALETTE.uiHighlight : PALETTE.cupShadow;
  drawTextLoc(ctx, t('streak') + ' x' + GameState.streak, 230, y + 3, streakColor, 1);
}

// ---- Processing Progress Bar ----
function drawProcessingBar(ctx) {
  if (!GameState.workspace.processing) return;

  var barW = 60;
  var barH = 6;
  var barX = Math.floor(GAME_W / 2 - barW / 2);
  var barY = 96;

  rect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, PALETTE.uiBorder);
  rect(ctx, barX, barY, barW, barH, PALETTE.metalDark);

  var progress = 1 - (GameState.workspace.processTimer / GameState.workspace.processTotal);
  var fillW = Math.floor(barW * progress);
  rect(ctx, barX, barY, fillW, barH, PALETTE.uiHighlight);

  var ing = INGREDIENTS[GameState.workspace.processIngredient];
  if (ing) {
    drawTextLocCentered(ctx, t(ing.nameKey) + '...', GAME_W / 2, barY - 9, PALETTE.uiHighlight, 1);
  }
}

// ---- Language Toggle Button ----
var LANG_BTN_W = 36;
var LANG_BTN_H = 14;
var LANG_BTN_X = GAME_W - LANG_BTN_W - 2;
var LANG_BTN_Y = 2;

function drawLangButton(ctx) {
  rect(ctx, LANG_BTN_X, LANG_BTN_Y, LANG_BTN_W, LANG_BTN_H, PALETTE.uiBg);
  rect(ctx, LANG_BTN_X, LANG_BTN_Y, LANG_BTN_W, 1, PALETTE.uiHighlight);
  rect(ctx, LANG_BTN_X, LANG_BTN_Y + LANG_BTN_H - 1, LANG_BTN_W, 1, PALETTE.uiHighlight);
  rect(ctx, LANG_BTN_X, LANG_BTN_Y, 1, LANG_BTN_H, PALETTE.uiHighlight);
  rect(ctx, LANG_BTN_X + LANG_BTN_W - 1, LANG_BTN_Y, 1, LANG_BTN_H, PALETTE.uiHighlight);
  // Always render in bitmap font (English-only label) so it stays compact
  var label = Lang === 'zh' ? 'CN/EN' : 'EN/CN';
  drawTextCentered(ctx, label, LANG_BTN_X + LANG_BTN_W / 2, LANG_BTN_Y + 4, PALETTE.uiHighlight, 1);
}

function isLangButtonClick(gx, gy) {
  return gx >= LANG_BTN_X && gx < LANG_BTN_X + LANG_BTN_W &&
         gy >= LANG_BTN_Y && gy < LANG_BTN_Y + LANG_BTN_H;
}

// ---- Rush Hour Banner ----
function drawRushHourBanner(ctx) {
  if (!GameState.rushHour) return;
  var pulse = Math.floor(GameState.rushHourTimer / 6) % 2 === 0;
  var color = pulse ? PALETTE.uiDanger : PALETTE.uiHighlight;
  rect(ctx, 0, 70, GAME_W, 8, PALETTE.uiBg);
  rect(ctx, 0, 70, GAME_W, 1, color);
  rect(ctx, 0, 77, GAME_W, 1, color);
  drawTextLocCentered(ctx, '! ' + t('rush_hour') + ' !', GAME_W / 2, 71, color, 1);
}

// ---- Streak Indicator (visual flair when high streak) ----
function drawStreakIndicator(ctx) {
  if (GameState.streak < 3) return;
  var pulse = Math.floor(GameState.menuBlink / 5) % 3;
  for (var i = 0; i < 3; i++) {
    var c = (i === pulse) ? PALETTE.uiHighlight : PALETTE.uiBorder;
    rect(ctx, 4 + i * 5, 70, 3, 3, c);
  }
}

// ---- Floating Texts ----
function renderFloatingTexts(ctx) {
  for (var i = 0; i < GameState.floatingTexts.length; i++) {
    var ft = GameState.floatingTexts[i];
    drawTextLocCentered(ctx, ft.text, ft.x, ft.y, ft.color, 1);
  }
}
