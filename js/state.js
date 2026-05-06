var GAME_W = 320;
var GAME_H = 240;

var GameState = {
  scene: 'menu',
  day: 1,
  money: 0,
  score: 0,
  reputation: 100,
  streak: 0,
  bestStreakAllTime: 0,
  rushHour: false,
  rushHourTimer: 0,
  unlockedDrinks: ['espresso', 'americano'],
  currentOrders: [],
  workspace: {
    cup: null,
    processing: false,
    processTimer: 0,
    processTotal: 0,
    processIngredient: null
  },
  dayStats: {
    served: 0,
    perfect: 0,
    failed: 0,
    earnings: 0,
    tips: 0,
    totalCustomers: 0,
    bestStreak: 0
  },
  customersSpawned: 0,
  customersTarget: 0,
  spawnTimer: 0,
  selectedOrder: -1,
  floatingTexts: [],
  dayEndSummary: null,
  newUnlocks: null,
  menuBlink: 0,
  steamFrame: 0,
  steamTimer: 0,
  dayTimer: 0
};

function resetDayStats() {
  GameState.dayStats = {
    served: 0, perfect: 0, failed: 0,
    earnings: 0, tips: 0, totalCustomers: 0, bestStreak: 0
  };
  GameState.customersSpawned = 0;
  GameState.spawnTimer = 0;
  GameState.selectedOrder = -1;
  GameState.workspace.cup = null;
  GameState.workspace.processing = false;
  GameState.currentOrders = [];
  GameState.floatingTexts = [];
  GameState.dayTimer = 0;
  GameState.streak = 0;
  GameState.rushHour = false;
  GameState.rushHourTimer = 0;
}

function resetGame() {
  GameState.scene = 'menu';
  GameState.day = 1;
  GameState.money = 0;
  GameState.score = 0;
  GameState.reputation = 100;
  GameState.bestStreakAllTime = 0;
  GameState.unlockedDrinks = ['espresso', 'americano'];
  resetDayStats();
}
