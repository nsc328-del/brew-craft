var RECIPES = {
  espresso: {
    nameKey: 'drink_espresso',
    cupSize: 'small',
    steps: ['espresso_shot'],
    color: '#3d1c02',
    price: 3,
    unlockDay: 1,
    difficulty: 1
  },
  americano: {
    nameKey: 'drink_americano',
    cupSize: 'medium',
    steps: ['espresso_shot', 'hot_water'],
    color: '#5c3a1e',
    price: 4,
    unlockDay: 1,
    difficulty: 1
  },
  latte: {
    nameKey: 'drink_latte',
    cupSize: 'large',
    steps: ['espresso_shot', 'steamed_milk'],
    color: '#c4a882',
    price: 5,
    unlockDay: 2,
    difficulty: 2
  },
  cappuccino: {
    nameKey: 'drink_cappuccino',
    cupSize: 'medium',
    steps: ['espresso_shot', 'steamed_milk', 'milk_foam'],
    color: '#d4b896',
    price: 5,
    unlockDay: 3,
    difficulty: 2
  },
  macchiato: {
    nameKey: 'drink_macchiato',
    cupSize: 'small',
    steps: ['espresso_shot', 'milk_foam'],
    color: '#9c7048',
    price: 5,
    unlockDay: 4,
    difficulty: 2
  },
  mocha: {
    nameKey: 'drink_mocha',
    cupSize: 'large',
    steps: ['espresso_shot', 'chocolate_syrup', 'steamed_milk', 'whipped_cream'],
    color: '#6b3a2a',
    price: 7,
    unlockDay: 5,
    difficulty: 3
  },
  hot_chocolate: {
    nameKey: 'drink_hot_chocolate',
    cupSize: 'large',
    steps: ['chocolate_syrup', 'steamed_milk', 'whipped_cream'],
    color: '#5c3317',
    price: 6,
    unlockDay: 6,
    difficulty: 2
  },
  caramel_latte: {
    nameKey: 'drink_caramel_latte',
    cupSize: 'large',
    steps: ['espresso_shot', 'caramel_syrup', 'steamed_milk'],
    color: '#b08660',
    price: 8,
    unlockDay: 7,
    difficulty: 3
  }
};

var INGREDIENTS = {
  espresso_shot:   { nameKey: 'espresso_label', processTime: 60, color: '#3d1c02' },
  hot_water:       { nameKey: 'water_label',    processTime: 30, color: '#a0c4e8' },
  steamed_milk:    { nameKey: 'milk_label',     processTime: 45, color: '#faf0e6' },
  milk_foam:       { nameKey: 'foam_label',     processTime: 35, color: '#ffffff' },
  chocolate_syrup: { nameKey: 'choc_label',     processTime: 15, color: '#5c3317' },
  whipped_cream:   { nameKey: 'whip_label',     processTime: 15, color: '#fffef0' },
  caramel_syrup:   { nameKey: 'caramel_label',  processTime: 15, color: '#c68e17' }
};

var INGREDIENT_LIST = [
  'espresso_shot', 'hot_water', 'steamed_milk',
  'milk_foam', 'chocolate_syrup', 'whipped_cream', 'caramel_syrup'
];

function validateDrink(cupContents, targetRecipe) {
  var recipe = RECIPES[targetRecipe];
  if (!recipe) return { match: false, score: 0, perfect: false };

  var required = recipe.steps.slice();
  var provided = cupContents.slice();

  var matchCount = 0;
  for (var i = 0; i < required.length; i++) {
    var idx = provided.indexOf(required[i]);
    if (idx !== -1) {
      matchCount++;
      provided.splice(idx, 1);
    }
  }

  var extraPenalty = provided.length * 20;
  var accuracy = Math.round((matchCount / required.length) * 100) - extraPenalty;

  var orderCorrect = true;
  if (matchCount === required.length) {
    var pos = -1;
    for (var j = 0; j < required.length; j++) {
      var newPos = cupContents.indexOf(required[j]);
      if (newPos <= pos) { orderCorrect = false; break; }
      pos = newPos;
    }
  }

  if (orderCorrect && matchCount === required.length && provided.length === 0) {
    accuracy = 100;
  }

  var finalScore = Math.max(0, Math.min(100, accuracy));

  return {
    match: matchCount === required.length && provided.length === 0,
    score: finalScore,
    perfect: finalScore >= 95
  };
}
