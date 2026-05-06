var canvas, ctx, offscreen, offCtx;
var lastTime = 0;
var FRAME_TIME = 1000 / 30;

function resize() {
  var scale = Math.min(
    window.innerWidth / GAME_W,
    window.innerHeight / GAME_H
  );
  scale = Math.floor(scale) || 1;
  canvas.width = GAME_W * scale;
  canvas.height = GAME_H * scale;
  ctx.imageSmoothingEnabled = false;
}

function update() {
  switch (GameState.scene) {
    case 'playing':
      updateOrders();
      updateProcessing();
      updateFloatingTexts();
      maybeTriggerRushHour();
      updateRushHour();
      GameState.steamTimer++;
      if (GameState.steamTimer >= 6) {
        GameState.steamTimer = 0;
        GameState.steamFrame = (GameState.steamFrame + 1) % 3;
      }
      GameState.dayTimer++;
      GameState.menuBlink++;
      break;
    case 'menu':
    case 'dayEnd':
    case 'gameOver':
      GameState.menuBlink++;
      break;
  }
}

function render() {
  offCtx.fillStyle = PALETTE.uiBg;
  offCtx.fillRect(0, 0, GAME_W, GAME_H);

  switch (GameState.scene) {
    case 'menu':
      renderMenu(offCtx);
      break;
    case 'playing':
      renderPlaying(offCtx);
      break;
    case 'dayEnd':
      renderDayEnd(offCtx);
      break;
    case 'gameOver':
      renderGameOver(offCtx);
      break;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
}

function gameLoop(timestamp) {
  var delta = timestamp - lastTime;
  if (delta >= FRAME_TIME) {
    lastTime = timestamp - (delta % FRAME_TIME);
    update();
    render();
  }
  requestAnimationFrame(gameLoop);
}

function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  offscreen = document.createElement('canvas');
  offscreen.width = GAME_W;
  offscreen.height = GAME_H;
  offCtx = offscreen.getContext('2d');
  offCtx.imageSmoothingEnabled = false;

  loadLang();
  initSprites();
  initAudio();
  initInput();
  resize();
  window.addEventListener('resize', resize);

  // Wait for Zpix font to load before starting render loop (avoids flicker
  // from the system-font fallback on first frame). 1.5s timeout fallback.
  var startLoop = function() { requestAnimationFrame(gameLoop); };
  if (document.fonts && document.fonts.load) {
    var fontLoad = document.fonts.load('12px Zpix', '咖啡');
    var timeout = new Promise(function(r) { setTimeout(r, 1500); });
    Promise.race([fontLoad, timeout]).then(startLoop, startLoop);
  } else {
    startLoop();
  }
}

window.onload = init;
