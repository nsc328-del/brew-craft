var canvasEl, canvasScale;

function initInput() {
  canvasEl = document.getElementById('game');
  canvasEl.addEventListener('mousedown', onPointerDown);
  canvasEl.addEventListener('touchstart', function(e) {
    e.preventDefault();
    var touch = e.touches[0];
    onPointerDown({ clientX: touch.clientX, clientY: touch.clientY });
  }, { passive: false });
}

function screenToGame(clientX, clientY) {
  var r = canvasEl.getBoundingClientRect();
  return {
    x: Math.floor((clientX - r.left) / (r.width / GAME_W)),
    y: Math.floor((clientY - r.top) / (r.height / GAME_H))
  };
}

function onPointerDown(e) {
  var pos = screenToGame(e.clientX, e.clientY);
  var gx = pos.x, gy = pos.y;

  // Language toggle is available on every scene
  if (isLangButtonClick(gx, gy)) {
    toggleLang();
    playSound('click');
    return;
  }

  switch (GameState.scene) {
    case 'menu': handleMenuClick(gx, gy); break;
    case 'playing': handlePlayClick(gx, gy); break;
    case 'dayEnd': handleDayEndClick(gx, gy); break;
    case 'gameOver': handleGameOverClick(gx, gy); break;
  }
}

function handleMenuClick() {
  startDay();
  playSound('click');
}

function handleDayEndClick() {
  if (isGameOver()) {
    GameState.scene = 'gameOver';
  } else {
    startDay();
  }
  playSound('click');
}

function handleGameOverClick() {
  resetGame();
  GameState.scene = 'menu';
  playSound('click');
}

function handlePlayClick(gx, gy) {
  // Order cards
  if (gy < 70) {
    var orders = GameState.currentOrders;
    var slotW = 100;
    var startX = Math.floor((GAME_W - Math.min(orders.length, 3) * slotW) / 2);
    for (var i = 0; i < orders.length && i < 3; i++) {
      var ox = startX + i * slotW;
      if (gx >= ox && gx < ox + slotW - 4 && orders[i].status === 'waiting') {
        GameState.selectedOrder = (GameState.selectedOrder === i) ? -1 : i;
        playSound('click');
        return;
      }
    }
    return;
  }

  // Ingredient bar
  if (gy >= IBAR_Y && gy < IBAR_Y + IBAR_SLOT_H) {
    var iStartX = getIBarStartX();
    for (var j = 0; j < IBAR_ITEMS.length; j++) {
      var ix = iStartX + j * (IBAR_SLOT_W + IBAR_GAP);
      if (gx >= ix && gx < ix + IBAR_SLOT_W) {
        handleIngredientClick(IBAR_ITEMS[j]);
        return;
      }
    }

    // Serve/trash buttons
    var btnX = iStartX + IBAR_ITEMS.length * (IBAR_SLOT_W + IBAR_GAP) + 4;
    if (gx >= btnX && gx < btnX + 36) {
      if (gy < IBAR_Y + 12) serveDrink();
      else trashCup();
    }
    return;
  }

  if (gy >= 90 && gy < 168 && gx >= 120 && gx < 200) {
    if (GameState.workspace.cup) playSound('click');
  }
}

function handleIngredientClick(type) {
  if (GameState.workspace.processing) {
    addFloatingText(GAME_W / 2, IBAR_Y - 10, t('wait_dots'), PALETTE.uiDanger);
    return;
  }

  if (type === 'new_cup') {
    if (GameState.workspace.cup) {
      addFloatingText(GAME_W / 2, IBAR_Y - 10, t('trash_first'), PALETTE.uiDanger);
      return;
    }
    var cupSize = 'medium';
    if (GameState.selectedOrder >= 0 && GameState.selectedOrder < GameState.currentOrders.length) {
      var order = GameState.currentOrders[GameState.selectedOrder];
      var recipe = RECIPES[order.drink];
      if (recipe) cupSize = recipe.cupSize;
    }
    GameState.workspace.cup = { size: cupSize, contents: [] };
    playSound('click');
    var cupKey = cupSize === 'small' ? 'small_cup' : (cupSize === 'large' ? 'large_cup' : 'medium_cup');
    addFloatingText(GAME_W / 2, 130, t(cupKey), PALETTE.uiText);
    return;
  }

  if (!GameState.workspace.cup) {
    addFloatingText(GAME_W / 2, IBAR_Y - 10, t('place_cup'), PALETTE.uiDanger);
    return;
  }

  var ing = INGREDIENTS[type];
  if (!ing) return;

  GameState.workspace.processing = true;
  GameState.workspace.processTimer = ing.processTime;
  GameState.workspace.processTotal = ing.processTime;
  GameState.workspace.processIngredient = type;

  if (type === 'espresso_shot') playSound('espresso');
  else if (type === 'steamed_milk' || type === 'milk_foam') playSound('steam');
  else playSound('pour');
}

function updateProcessing() {
  if (!GameState.workspace.processing) return;

  GameState.workspace.processTimer--;
  if (GameState.workspace.processTimer <= 0) {
    GameState.workspace.processing = false;
    if (GameState.workspace.cup) {
      GameState.workspace.cup.contents.push(GameState.workspace.processIngredient);
      playSound('serve');
    }
    GameState.workspace.processIngredient = null;
  }
}
