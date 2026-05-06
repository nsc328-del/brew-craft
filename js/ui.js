// ---- Menu Screen ----
function renderMenu(ctx) {
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  rect(ctx, 0, 0, GAME_W, 2, PALETTE.woodMid);
  rect(ctx, 0, GAME_H - 2, GAME_W, 2, PALETTE.woodMid);
  rect(ctx, 0, 0, 2, GAME_H, PALETTE.woodMid);
  rect(ctx, GAME_W - 2, 0, 2, GAME_H, PALETTE.woodMid);

  // Title - keep BREW CRAFT in pixel font for branding
  drawTextCentered(ctx, 'BREW CRAFT', GAME_W / 2, 30, PALETTE.uiHighlight, 3);
  // Show localized title only in Chinese mode (EN already shows BREW CRAFT)
  if (Lang === 'zh') {
    drawTextLocCentered(ctx, t('title'), GAME_W / 2, 58, PALETTE.cream, 1);
  }

  // Coffee cup decoration
  var cupX = GAME_W / 2 - 12, cupY = 76;
  rect(ctx, cupX, cupY, 24, 4, PALETTE.cupRim);
  rect(ctx, cupX, cupY + 4, 24, 20, PALETTE.cupWhite);
  rect(ctx, cupX + 2, cupY + 6, 20, 12, PALETTE.espresso);
  rect(ctx, cupX + 4, cupY + 6, 16, 4, PALETTE.coffeeMid);
  rect(ctx, cupX + 24, cupY + 8, 4, 2, PALETTE.cupShadow);
  rect(ctx, cupX + 26, cupY + 8, 2, 8, PALETTE.cupShadow);
  rect(ctx, cupX + 24, cupY + 14, 4, 2, PALETTE.cupShadow);

  GameState.menuBlink++;
  var steamOffset = Math.floor(GameState.menuBlink / 8) % 4;
  ctx.globalAlpha = 0.5;
  px(ctx, cupX + 6, cupY - 2 - steamOffset, '#ffffff');
  px(ctx, cupX + 10, cupY - 4 - steamOffset, '#eeeeee');
  px(ctx, cupX + 14, cupY - 1 - steamOffset, '#ffffff');
  px(ctx, cupX + 18, cupY - 3 - steamOffset, '#eeeeee');
  ctx.globalAlpha = 1;
  rect(ctx, cupX - 4, cupY + 24, 32, 4, PALETTE.cupShadow);

  drawTextLocCentered(ctx, t('subtitle'), GAME_W / 2, 112, PALETTE.cream, 1);

  if (Math.floor(GameState.menuBlink / 20) % 2 === 0) {
    drawTextLocCentered(ctx, t('click_start'), GAME_W / 2, 140, PALETTE.uiHighlight, 2);
  }

  drawTextLocCentered(ctx, t('instr1'), GAME_W / 2, 175, PALETTE.cream, 1);
  drawTextLocCentered(ctx, t('instr2'), GAME_W / 2, 188, PALETTE.cream, 1);
  drawTextLocCentered(ctx, t('instr3'), GAME_W / 2, 201, PALETTE.cream, 1);

  // Language toggle button
  drawLangButton(ctx);
}

// ---- Day End Screen ----
function renderDayEnd(ctx) {
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  var s = GameState.dayEndSummary;
  if (!s) return;

  drawTextLocCentered(ctx, t('day_complete', s.day), GAME_W / 2, 14, PALETTE.uiHighlight, 2);

  var y = 40;
  var lx = 50, vx = 200;

  drawTextLoc(ctx, t('customers_label'), lx, y, PALETTE.cream, 1);
  drawText(ctx, '' + s.served + '/' + s.totalCustomers, vx, y, PALETTE.uiText, 1);
  y += 12;

  drawTextLoc(ctx, t('perfect_label'), lx, y, PALETTE.cream, 1);
  drawText(ctx, '' + s.perfect, vx, y, PALETTE.uiHighlight, 1);
  y += 12;

  drawTextLoc(ctx, t('failed_label'), lx, y, PALETTE.cream, 1);
  drawText(ctx, '' + s.failed, vx, y, PALETTE.uiDanger, 1);
  y += 12;

  drawTextLoc(ctx, t('earnings_label'), lx, y, PALETTE.cream, 1);
  drawText(ctx, '$' + s.earnings, vx, y, PALETTE.uiSuccess, 1);
  y += 12;

  drawTextLoc(ctx, t('tips_label'), lx, y, PALETTE.cream, 1);
  drawText(ctx, '$' + s.tips, vx, y, PALETTE.uiHighlight, 1);
  y += 12;

  drawTextLoc(ctx, t('best_streak'), lx, y, PALETTE.cream, 1);
  drawText(ctx, 'x' + (s.bestStreak || 0), vx, y, PALETTE.uiHighlight, 1);
  y += 12;

  drawTextLoc(ctx, t('rep_label'), lx, y, PALETTE.cream, 1);
  var stars = Math.ceil(s.reputation / 20);
  for (var i = 0; i < 5; i++) {
    var star = i < stars ? SpriteCache.star_filled : SpriteCache.star_empty;
    ctx.drawImage(star, vx + i * 9, y);
  }
  y += 18;

  if (GameState.newUnlocks && GameState.newUnlocks.length > 0) {
    drawTextLocCentered(ctx, t('new_drink_unlocked'), GAME_W / 2, y, PALETTE.uiHighlight, 2);
    y += 18;
    for (var j = 0; j < GameState.newUnlocks.length; j++) {
      var r = RECIPES[GameState.newUnlocks[j]];
      if (r) {
        drawTextLocCentered(ctx, t(r.nameKey) + ' - $' + r.price, GAME_W / 2, y, PALETTE.uiText, 1);
        y += 11;
      }
    }
  }

  if (isGameOver()) {
    drawTextLocCentered(ctx, t('rep_too_low'), GAME_W / 2, GAME_H - 50, PALETTE.uiDanger, 2);
    drawTextLocCentered(ctx, t('game_over_text'), GAME_W / 2, GAME_H - 30, PALETTE.uiDanger, 1);
  }

  if (Math.floor(GameState.menuBlink / 20) % 2 === 0) {
    drawTextLocCentered(ctx, t('click_continue'), GAME_W / 2, GAME_H - 16, PALETTE.uiText, 1);
  }
  GameState.menuBlink++;

  drawLangButton(ctx);
}

// ---- Game Over Screen ----
function renderGameOver(ctx) {
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  drawTextLocCentered(ctx, t('game_over'), GAME_W / 2, 40, PALETTE.uiDanger, 3);
  drawTextLocCentered(ctx, t('coffee_closed'), GAME_W / 2, 80, PALETTE.cream, 1);

  drawTextLoc(ctx, t('days_survived'), 80, 110, PALETTE.cream, 1);
  drawText(ctx, '' + (GameState.day - 1), 220, 110, PALETTE.uiHighlight, 1);

  drawTextLoc(ctx, t('total_score'), 80, 126, PALETTE.cream, 1);
  drawText(ctx, '' + GameState.score, 220, 126, PALETTE.uiHighlight, 1);

  drawTextLoc(ctx, t('total_money'), 80, 142, PALETTE.cream, 1);
  drawText(ctx, '$' + GameState.money, 220, 142, PALETTE.uiSuccess, 1);

  drawTextLoc(ctx, t('best_streak'), 80, 158, PALETTE.cream, 1);
  drawText(ctx, 'x' + GameState.bestStreakAllTime, 220, 158, PALETTE.uiHighlight, 1);

  GameState.menuBlink++;
  if (Math.floor(GameState.menuBlink / 20) % 2 === 0) {
    drawTextLocCentered(ctx, t('click_restart'), GAME_W / 2, 195, PALETTE.uiText, 2);
  }

  drawLangButton(ctx);
}
