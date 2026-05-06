var PALETTE = {
  espresso: '#3d1c02', coffeeMid: '#6b3a1a', coffeeLight: '#8b6914',
  cream: '#f5e6c8', milk: '#faf0e6', foam: '#ffffff',
  chocolate: '#5c3317', caramel: '#c68e17',
  woodLight: '#c19a6b', woodMid: '#a0522d', woodDark: '#6b3a2a', woodShadow: '#4a2511',
  metalLight: '#c0c0c0', metalMid: '#909090', metalDark: '#606060', metalShine: '#e0e0e0',
  cupWhite: '#f0ead6', cupShadow: '#d4c9a8', cupRim: '#e0d8c0',
  uiBg: '#2c1810', uiBgLight: '#3d261a', uiBorder: '#6b3a2a',
  uiText: '#f5e6c8', uiHighlight: '#ffd700', uiDanger: '#cc3333', uiSuccess: '#33aa33',
  wallTop: '#8b7355', wallBot: '#6b5535', wallDark: '#5a4530',
  waterColor: '#a0c4e8', whipColor: '#fffef0', vanillaColor: '#f5deb3',
  red: '#cc4444', green: '#44aa44', black: '#1a1a1a'
};

var SKIN_TONES = ['#ffdbb4', '#e8b88a', '#c68642', '#8d5524', '#6b4226'];
var HAIR_COLORS = ['#2c1810', '#8b4513', '#daa520', '#b22222', '#e8e8e8', '#1a1a2e'];
var SHIRT_COLORS = ['#4169e1', '#dc143c', '#228b22', '#ff8c00', '#9370db', '#2f4f4f', '#cd853f', '#708090'];

var SpriteCache = {};

function createSprite(w, h, drawFn) {
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawFn(ctx, w, h);
  return c;
}

function px(ctx, x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, 1);
}

function rect(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

// ---- Bitmap Font 5x7 ----
var FONT_DATA = {
  'A':[0x04,0x0A,0x11,0x1F,0x11,0x11,0x11],'B':[0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  'C':[0x0E,0x11,0x10,0x10,0x10,0x11,0x0E],'D':[0x1C,0x12,0x11,0x11,0x11,0x12,0x1C],
  'E':[0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F],'F':[0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
  'G':[0x0E,0x11,0x10,0x17,0x11,0x11,0x0E],'H':[0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'I':[0x0E,0x04,0x04,0x04,0x04,0x04,0x0E],'J':[0x07,0x02,0x02,0x02,0x02,0x12,0x0C],
  'K':[0x11,0x12,0x14,0x18,0x14,0x12,0x11],'L':[0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
  'M':[0x11,0x1B,0x15,0x15,0x11,0x11,0x11],'N':[0x11,0x11,0x19,0x15,0x13,0x11,0x11],
  'O':[0x0E,0x11,0x11,0x11,0x11,0x11,0x0E],'P':[0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'Q':[0x0E,0x11,0x11,0x11,0x15,0x12,0x0D],'R':[0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  'S':[0x0E,0x11,0x10,0x0E,0x01,0x11,0x0E],'T':[0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  'U':[0x11,0x11,0x11,0x11,0x11,0x11,0x0E],'V':[0x11,0x11,0x11,0x11,0x11,0x0A,0x04],
  'W':[0x11,0x11,0x11,0x15,0x15,0x1B,0x11],'X':[0x11,0x11,0x0A,0x04,0x0A,0x11,0x11],
  'Y':[0x11,0x11,0x0A,0x04,0x04,0x04,0x04],'Z':[0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
  '0':[0x0E,0x11,0x13,0x15,0x19,0x11,0x0E],'1':[0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
  '2':[0x0E,0x11,0x01,0x02,0x04,0x08,0x1F],'3':[0x0E,0x11,0x01,0x06,0x01,0x11,0x0E],
  '4':[0x02,0x06,0x0A,0x12,0x1F,0x02,0x02],'5':[0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
  '6':[0x06,0x08,0x10,0x1E,0x11,0x11,0x0E],'7':[0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
  '8':[0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E],'9':[0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
  ' ':[0,0,0,0,0,0,0],
  '.':[0,0,0,0,0,0,0x04],
  '!':[0x04,0x04,0x04,0x04,0x04,0,0x04],
  '?':[0x0E,0x11,0x01,0x02,0x04,0,0x04],
  ':':[0,0,0x04,0,0x04,0,0],
  '$':[0x04,0x0F,0x14,0x0E,0x05,0x1E,0x04],
  '+':[0,0x04,0x04,0x1F,0x04,0x04,0],
  '-':[0,0,0,0x0E,0,0,0],
  ',':[0,0,0,0,0,0x04,0x08],
  '/':[0x01,0x02,0x02,0x04,0x08,0x08,0x10],
  '%':[0x18,0x19,0x02,0x04,0x08,0x13,0x03],
  'x':[0,0,0x11,0x0A,0x04,0x0A,0x11],
  '*':[0,0x04,0x15,0x0E,0x15,0x04,0],
  '(':[0x02,0x04,0x08,0x08,0x08,0x04,0x02],
  ')':[0x08,0x04,0x02,0x02,0x02,0x04,0x08]
};

function drawText(ctx, text, x, y, color, scale) {
  color = color || PALETTE.uiText;
  scale = scale || 1;
  ctx.fillStyle = color;
  var str = text.toUpperCase();
  var cx = x;
  for (var i = 0; i < str.length; i++) {
    var glyph = FONT_DATA[str[i]];
    if (glyph) {
      for (var row = 0; row < 7; row++) {
        for (var col = 0; col < 5; col++) {
          if (glyph[row] & (0x10 >> col)) {
            ctx.fillRect(cx + col * scale, y + row * scale, scale, scale);
          }
        }
      }
    }
    cx += 6 * scale;
  }
}

function textWidth(text, scale) {
  scale = scale || 1;
  return text.length * 6 * scale - scale;
}

function drawTextCentered(ctx, text, cx, y, color, scale) {
  var w = textWidth(text, scale);
  drawText(ctx, text, Math.floor(cx - w / 2), y, color, scale);
}

// ---- Chinese text rendering (uses canvas fillText) ----
function drawChinText(ctx, text, x, y, color, scale) {
  scale = scale || 1;
  var fontSize = 7 * scale;
  if (scale === 1) fontSize = 8;
  ctx.save();
  ctx.fillStyle = color || PALETTE.uiText;
  ctx.font = fontSize + 'px ui-monospace, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", monospace';
  ctx.textBaseline = 'top';
  ctx.imageSmoothingEnabled = false;
  ctx.fillText(text, Math.floor(x), Math.floor(y));
  ctx.restore();
}

function chinTextWidth(text, scale) {
  scale = scale || 1;
  var fontSize = 7 * scale;
  if (scale === 1) fontSize = 8;
  var w = 0;
  for (var i = 0; i < text.length; i++) {
    var ch = text.charCodeAt(i);
    if (ch >= 0x4e00 && ch <= 0x9fff) w += fontSize;
    else if (ch >= 0x3000 && ch <= 0x303f) w += fontSize;
    else if (ch >= 0xff00 && ch <= 0xffef) w += fontSize;
    else w += fontSize * 0.55;
  }
  return Math.ceil(w);
}

// ---- Localized text functions (auto-detect Chinese vs ASCII) ----
function drawTextLoc(ctx, text, x, y, color, scale) {
  if (containsChinese(text)) {
    drawChinText(ctx, text, x, y, color, scale);
  } else {
    drawText(ctx, text, x, y, color, scale);
  }
}

function textWidthLoc(text, scale) {
  if (containsChinese(text)) return chinTextWidth(text, scale);
  return textWidth(text, scale);
}

function drawTextLocCentered(ctx, text, cx, y, color, scale) {
  var w = textWidthLoc(text, scale);
  drawTextLoc(ctx, text, Math.floor(cx - w / 2), y, color, scale);
}

// ---- Sprite Drawing Functions ----

function drawCupSprite(ctx, size) {
  var w, h, bodyW, bodyH, rimH, baseH, handleW;
  if (size === 'small') { w = 12; h = 14; bodyW = 8; bodyH = 8; rimH = 2; baseH = 2; handleW = 2; }
  else if (size === 'medium') { w = 14; h = 17; bodyW = 10; bodyH = 10; rimH = 2; baseH = 2; handleW = 2; }
  else { w = 16; h = 20; bodyW = 12; bodyH = 12; rimH = 2; baseH = 2; handleW = 2; }

  var ox = Math.floor((w - bodyW) / 2);
  var oy = rimH;

  // Rim
  rect(ctx, ox, 0, bodyW, rimH, PALETTE.cupRim);
  // Body
  rect(ctx, ox, oy, bodyW, bodyH, PALETTE.cupWhite);
  // Shadow right edge
  rect(ctx, ox + bodyW - 1, oy, 1, bodyH, PALETTE.cupShadow);
  // Shadow bottom edge
  rect(ctx, ox, oy + bodyH - 1, bodyW, 1, PALETTE.cupShadow);
  // Handle
  rect(ctx, ox + bodyW, oy + 2, handleW, 1, PALETTE.cupShadow);
  rect(ctx, ox + bodyW + handleW - 1, oy + 2, 1, 3, PALETTE.cupShadow);
  rect(ctx, ox + bodyW, oy + 4, handleW, 1, PALETTE.cupShadow);
  // Base
  rect(ctx, ox + 1, oy + bodyH, bodyW - 2, baseH, PALETTE.cupRim);
}

function drawEspressoMachineSprite(ctx) {
  // Body (40x48)
  rect(ctx, 4, 2, 32, 44, PALETTE.metalMid);
  // Top section (darker)
  rect(ctx, 4, 2, 32, 8, PALETTE.metalDark);
  // Shine line
  rect(ctx, 6, 4, 1, 4, PALETTE.metalShine);
  // Buttons
  rect(ctx, 28, 4, 3, 3, PALETTE.green);
  rect(ctx, 24, 4, 3, 3, PALETTE.red);
  // Group head area
  rect(ctx, 10, 14, 20, 4, PALETTE.metalDark);
  // Portafilter
  rect(ctx, 12, 18, 16, 3, PALETTE.metalLight);
  rect(ctx, 14, 21, 12, 2, PALETTE.metalMid);
  // Nozzle
  rect(ctx, 18, 23, 4, 2, PALETTE.metalDark);
  // Drip tray
  rect(ctx, 8, 38, 24, 3, PALETTE.metalDark);
  rect(ctx, 10, 38, 20, 1, PALETTE.metalLight);
  // Steam wand (right side)
  rect(ctx, 34, 12, 2, 16, PALETTE.metalLight);
  rect(ctx, 34, 28, 3, 2, PALETTE.metalMid);
  // Front panel detail lines
  rect(ctx, 4, 12, 32, 1, PALETTE.metalDark);
  rect(ctx, 4, 36, 32, 1, PALETTE.metalDark);
  // Brand plate
  rect(ctx, 14, 28, 12, 6, PALETTE.metalDark);
  rect(ctx, 15, 29, 10, 4, PALETTE.metalShine);
}

function drawSteamerSprite(ctx) {
  // Milk pitcher (20x32)
  // Handle
  rect(ctx, 1, 8, 2, 1, PALETTE.metalMid);
  rect(ctx, 0, 9, 2, 8, PALETTE.metalMid);
  rect(ctx, 1, 17, 2, 1, PALETTE.metalMid);
  // Pitcher body
  rect(ctx, 4, 4, 12, 2, PALETTE.metalLight);
  rect(ctx, 3, 6, 14, 14, PALETTE.metalMid);
  // Spout
  rect(ctx, 16, 4, 2, 3, PALETTE.metalMid);
  // Shine
  rect(ctx, 5, 7, 1, 10, PALETTE.metalShine);
  // Milk inside (visible from top)
  rect(ctx, 5, 5, 10, 1, PALETTE.milk);
  // Base
  rect(ctx, 4, 20, 12, 2, PALETTE.metalDark);
}

function drawCustomerSprite(ctx, variant) {
  var skin = SKIN_TONES[variant % SKIN_TONES.length];
  var hair = HAIR_COLORS[variant % HAIR_COLORS.length];
  var shirt = SHIRT_COLORS[variant % SHIRT_COLORS.length];
  var darkSkin = darkenColor(skin, 30);

  // Shirt / body
  rect(ctx, 4, 22, 16, 10, shirt);
  rect(ctx, 2, 24, 20, 8, shirt);
  // Collar
  rect(ctx, 9, 22, 6, 2, darkenColor(shirt, 20));

  // Neck
  rect(ctx, 9, 19, 6, 4, skin);

  // Head
  rect(ctx, 6, 6, 12, 14, skin);
  // Ears
  rect(ctx, 5, 11, 2, 4, skin);
  rect(ctx, 17, 11, 2, 4, skin);

  // Hair styles
  switch (variant % 6) {
    case 0: // short
      rect(ctx, 6, 4, 12, 5, hair);
      rect(ctx, 5, 6, 1, 3, hair);
      rect(ctx, 18, 6, 1, 3, hair);
      break;
    case 1: // long
      rect(ctx, 5, 3, 14, 6, hair);
      rect(ctx, 5, 6, 2, 14, hair);
      rect(ctx, 17, 6, 2, 14, hair);
      break;
    case 2: // curly
      rect(ctx, 5, 3, 14, 7, hair);
      rect(ctx, 4, 5, 1, 5, hair);
      rect(ctx, 19, 5, 1, 5, hair);
      px(ctx, 6, 3, hair); px(ctx, 9, 2, hair); px(ctx, 13, 2, hair); px(ctx, 16, 3, hair);
      break;
    case 3: // bald / very short
      rect(ctx, 6, 5, 12, 2, hair);
      break;
    case 4: // cap
      rect(ctx, 4, 3, 16, 5, hair);
      rect(ctx, 3, 7, 18, 2, darkenColor(hair, 20));
      break;
    case 5: // ponytail
      rect(ctx, 5, 3, 14, 6, hair);
      rect(ctx, 17, 3, 3, 4, hair);
      rect(ctx, 19, 7, 2, 8, hair);
      break;
  }

  // Eyes
  rect(ctx, 9, 13, 2, 2, PALETTE.black);
  rect(ctx, 14, 13, 2, 2, PALETTE.black);
  // Eye shine
  px(ctx, 9, 13, '#ffffff');
  px(ctx, 14, 13, '#ffffff');

  // Mouth
  rect(ctx, 10, 17, 4, 1, darkSkin);

  // Nose
  px(ctx, 12, 15, darkSkin);
}

function drawCustomerAngry(ctx, variant) {
  drawCustomerSprite(ctx, variant);
  var darkSkin = darkenColor(SKIN_TONES[variant % SKIN_TONES.length], 30);
  // Angry eyebrows
  rect(ctx, 8, 11, 3, 1, PALETTE.black);
  rect(ctx, 14, 11, 3, 1, PALETTE.black);
  // Frown
  ctx.clearRect(10, 17, 4, 1);
  rect(ctx, 10, 18, 4, 1, darkSkin);
  px(ctx, 9, 17, darkSkin);
  px(ctx, 14, 17, darkSkin);
}

function drawIngredientIcon(ctx, type) {
  switch (type) {
    case 'new_cup':
      rect(ctx, 4, 2, 8, 2, PALETTE.cupRim);
      rect(ctx, 4, 4, 8, 8, PALETTE.cupWhite);
      rect(ctx, 5, 12, 6, 2, PALETTE.cupRim);
      // Plus sign
      rect(ctx, 7, 6, 2, 4, PALETTE.uiSuccess);
      rect(ctx, 6, 7, 4, 2, PALETTE.uiSuccess);
      break;
    case 'espresso_shot':
      rect(ctx, 3, 3, 10, 10, PALETTE.espresso);
      rect(ctx, 5, 1, 6, 3, PALETTE.metalMid);
      rect(ctx, 6, 5, 4, 2, '#5c3a1e');
      // drip
      rect(ctx, 7, 13, 2, 2, PALETTE.espresso);
      break;
    case 'hot_water':
      rect(ctx, 4, 4, 8, 8, PALETTE.waterColor);
      rect(ctx, 5, 3, 6, 1, '#80a8cc');
      // steam
      px(ctx, 6, 1, '#ccddee'); px(ctx, 8, 0, '#ccddee'); px(ctx, 10, 1, '#ccddee');
      break;
    case 'steamed_milk':
      rect(ctx, 4, 3, 8, 10, PALETTE.milk);
      rect(ctx, 3, 5, 1, 6, PALETTE.metalMid);
      rect(ctx, 12, 5, 1, 6, PALETTE.metalMid);
      rect(ctx, 5, 2, 6, 2, '#e8e0d0');
      // steam
      px(ctx, 6, 0, '#eeeeee'); px(ctx, 9, 0, '#eeeeee');
      break;
    case 'milk_foam':
      rect(ctx, 3, 6, 10, 6, '#f0f0f0');
      // Bubbly top
      rect(ctx, 4, 4, 3, 3, '#ffffff');
      rect(ctx, 8, 5, 3, 2, '#ffffff');
      rect(ctx, 6, 3, 2, 2, '#ffffff');
      px(ctx, 5, 3, '#f8f8f8');
      px(ctx, 10, 4, '#f8f8f8');
      break;
    case 'chocolate_syrup':
      rect(ctx, 5, 2, 6, 11, PALETTE.chocolate);
      rect(ctx, 4, 2, 8, 3, '#6b4020');
      rect(ctx, 6, 1, 4, 2, '#8b6040');
      // label
      rect(ctx, 6, 6, 4, 3, '#daa520');
      break;
    case 'whipped_cream':
      // Swirl shape
      rect(ctx, 5, 8, 6, 4, PALETTE.whipColor);
      rect(ctx, 4, 6, 8, 3, '#ffffff');
      rect(ctx, 6, 4, 4, 3, '#ffffff');
      rect(ctx, 7, 2, 2, 3, '#ffffff');
      px(ctx, 8, 1, '#fffef0');
      break;
    case 'caramel_syrup':
      // Caramel bottle
      rect(ctx, 5, 2, 6, 11, PALETTE.caramelColor);
      rect(ctx, 4, 2, 8, 3, '#a87211');
      rect(ctx, 6, 1, 4, 2, '#d4a017');
      // label
      rect(ctx, 6, 7, 4, 3, '#fffef0');
      px(ctx, 7, 8, PALETTE.caramelColor);
      px(ctx, 8, 8, PALETTE.caramelColor);
      break;
    case 'serve':
      rect(ctx, 2, 4, 12, 8, PALETTE.uiSuccess);
      drawText(ctx, 'OK', 3, 5, '#ffffff', 1);
      break;
    case 'trash':
      rect(ctx, 2, 4, 12, 8, PALETTE.uiDanger);
      drawText(ctx, 'X', 5, 5, '#ffffff', 1);
      break;
  }
}

function drawPersonalityIcon(ctx, type) {
  switch (type) {
    case 'regular':
      // Smile face
      rect(ctx, 2, 2, 6, 6, '#ffeb99');
      px(ctx, 3, 4, PALETTE.black);
      px(ctx, 6, 4, PALETTE.black);
      rect(ctx, 3, 6, 4, 1, PALETTE.black);
      break;
    case 'hurry':
      // Clock / lightning
      rect(ctx, 2, 2, 6, 6, PALETTE.uiDanger);
      rect(ctx, 4, 3, 1, 3, '#ffffff');
      rect(ctx, 4, 5, 3, 1, '#ffffff');
      rect(ctx, 5, 5, 1, 2, '#ffffff');
      break;
    case 'vip':
      // Star
      px(ctx, 4, 1, PALETTE.uiHighlight);
      rect(ctx, 3, 2, 3, 1, PALETTE.uiHighlight);
      rect(ctx, 1, 3, 7, 1, PALETTE.uiHighlight);
      rect(ctx, 2, 4, 5, 1, PALETTE.uiHighlight);
      rect(ctx, 2, 5, 2, 1, PALETTE.uiHighlight);
      rect(ctx, 5, 5, 2, 1, PALETTE.uiHighlight);
      px(ctx, 1, 6, PALETTE.uiHighlight);
      px(ctx, 7, 6, PALETTE.uiHighlight);
      break;
    case 'friendly':
      // Heart
      rect(ctx, 2, 2, 2, 1, PALETTE.uiDanger);
      rect(ctx, 5, 2, 2, 1, PALETTE.uiDanger);
      rect(ctx, 1, 3, 7, 2, PALETTE.uiDanger);
      rect(ctx, 2, 5, 5, 1, PALETTE.uiDanger);
      rect(ctx, 3, 6, 3, 1, PALETTE.uiDanger);
      px(ctx, 4, 7, PALETTE.uiDanger);
      // Highlight
      px(ctx, 2, 3, '#ff8888');
      break;
  }
}

function drawLangIcon(ctx) {
  // Globe-like circle with line
  rect(ctx, 2, 2, 12, 12, PALETTE.uiBgLight);
  rect(ctx, 2, 2, 12, 1, PALETTE.uiBorder);
  rect(ctx, 2, 13, 12, 1, PALETTE.uiBorder);
  rect(ctx, 2, 2, 1, 12, PALETTE.uiBorder);
  rect(ctx, 13, 2, 1, 12, PALETTE.uiBorder);
}

function drawStar(ctx, filled) {
  var c = filled ? PALETTE.uiHighlight : PALETTE.metalDark;
  px(ctx, 3, 0, c);
  rect(ctx, 2, 1, 3, 1, c);
  rect(ctx, 0, 2, 7, 1, c);
  rect(ctx, 1, 3, 5, 1, c);
  rect(ctx, 1, 4, 5, 1, c);
  rect(ctx, 1, 5, 2, 1, c);
  rect(ctx, 4, 5, 2, 1, c);
}

function drawSteamParticle(ctx, frame) {
  var alpha = [0.6, 0.4, 0.2][frame % 3];
  ctx.globalAlpha = alpha;
  rect(ctx, 1, 4 - frame, 2, 2, '#ffffff');
  rect(ctx, 4, 3 - frame, 1, 2, '#eeeeee');
  rect(ctx, 2, 1 - Math.max(0, frame - 1), 1, 1, '#dddddd');
  ctx.globalAlpha = 1;
}

// ---- Color utility ----
function darkenColor(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function lightenColor(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ---- Init all sprite caches ----
function initSprites() {
  // Cups
  SpriteCache.cup_small = createSprite(14, 16, function(ctx) { drawCupSprite(ctx, 'small'); });
  SpriteCache.cup_medium = createSprite(16, 19, function(ctx) { drawCupSprite(ctx, 'medium'); });
  SpriteCache.cup_large = createSprite(18, 22, function(ctx) { drawCupSprite(ctx, 'large'); });

  // Equipment
  SpriteCache.espresso_machine = createSprite(40, 48, drawEspressoMachineSprite);
  SpriteCache.steamer = createSprite(22, 24, drawSteamerSprite);

  // Customers (8 variants)
  SpriteCache.customers = [];
  SpriteCache.customers_angry = [];
  for (var i = 0; i < 8; i++) {
    SpriteCache.customers.push(createSprite(24, 32, function(ctx) { drawCustomerSprite(ctx, i); }));
    SpriteCache.customers_angry.push(createSprite(24, 32, function(ctx) { drawCustomerAngry(ctx, i); }));
  }

  // Ingredient icons (16x16)
  var iconTypes = ['new_cup', 'espresso_shot', 'hot_water', 'steamed_milk', 'milk_foam', 'chocolate_syrup', 'whipped_cream', 'caramel_syrup', 'serve', 'trash'];
  SpriteCache.icons = {};
  for (var j = 0; j < iconTypes.length; j++) {
    (function(type) {
      SpriteCache.icons[type] = createSprite(16, 16, function(ctx) { drawIngredientIcon(ctx, type); });
    })(iconTypes[j]);
  }

  // Stars
  SpriteCache.star_filled = createSprite(7, 6, function(ctx) { drawStar(ctx, true); });
  SpriteCache.star_empty = createSprite(7, 6, function(ctx) { drawStar(ctx, false); });

  // Personality icons (10x10)
  SpriteCache.pers = {};
  var persTypes = ['regular', 'hurry', 'vip', 'friendly'];
  for (var p = 0; p < persTypes.length; p++) {
    (function(type) {
      SpriteCache.pers[type] = createSprite(10, 10, function(ctx) { drawPersonalityIcon(ctx, type); });
    })(persTypes[p]);
  }

  // Steam frames
  SpriteCache.steam = [];
  for (var k = 0; k < 3; k++) {
    (function(frame) {
      SpriteCache.steam.push(createSprite(6, 6, function(ctx) { drawSteamParticle(ctx, frame); }));
    })(k);
  }
}
