var UNLOCK_SCHEDULE = {
  1: ['espresso', 'americano'],
  2: ['latte'],
  3: ['cappuccino'],
  4: ['macchiato'],
  5: ['mocha'],
  6: ['hot_chocolate'],
  7: ['caramel_latte']
};

function getCustomersTarget(day) {
  return Math.floor(5 + day * 1.5);
}

function maybeTriggerRushHour() {
  // Rush hour triggers on day 3+, mid-day, lasting ~10 seconds (300 frames at 30fps)
  if (GameState.day < 3 || GameState.rushHour) return;
  var halfPoint = Math.floor(GameState.customersTarget * 0.4);
  var twoThirds = Math.floor(GameState.customersTarget * 0.7);
  if (GameState.dayStats.served >= halfPoint && GameState.dayStats.served < twoThirds && Math.random() < 0.02) {
    GameState.rushHour = true;
    GameState.rushHourTimer = 360;
    addFloatingText(GAME_W / 2, 60, t('rush_hour'), PALETTE.uiDanger);
    playSound('fail');
  }
}

function updateRushHour() {
  if (!GameState.rushHour) return;
  GameState.rushHourTimer--;
  if (GameState.rushHourTimer <= 0) {
    GameState.rushHour = false;
  }
}

function startDay() {
  resetDayStats();
  GameState.customersTarget = getCustomersTarget(GameState.day);
  GameState.scene = 'playing';

  var newDrinks = UNLOCK_SCHEDULE[GameState.day];
  if (newDrinks) {
    for (var i = 0; i < newDrinks.length; i++) {
      if (GameState.unlockedDrinks.indexOf(newDrinks[i]) === -1) {
        GameState.unlockedDrinks.push(newDrinks[i]);
      }
    }
  }
}

function endDay() {
  GameState.dayEndSummary = {
    day: GameState.day,
    served: GameState.dayStats.served,
    perfect: GameState.dayStats.perfect,
    failed: GameState.dayStats.failed,
    earnings: GameState.dayStats.earnings,
    tips: GameState.dayStats.tips,
    totalCustomers: GameState.customersTarget,
    reputation: GameState.reputation,
    bestStreak: GameState.dayStats.bestStreak
  };

  if (GameState.dayStats.bestStreak > GameState.bestStreakAllTime) {
    GameState.bestStreakAllTime = GameState.dayStats.bestStreak;
  }

  GameState.day++;
  GameState.newUnlocks = UNLOCK_SCHEDULE[GameState.day] || null;
  GameState.scene = 'dayEnd';
}

function isGameOver() {
  return GameState.reputation <= 0;
}
