var Lang = 'zh';

var I18N = {
  en: {
    title: 'BREW CRAFT',
    subtitle: 'COFFEE SHOP SIMULATOR',
    click_start: 'CLICK TO START',
    instr1: '1. CLICK ORDER TO SELECT',
    instr2: '2. PLACE CUP, ADD INGREDIENTS',
    instr3: '3. SERVE THE DRINK!',
    lang_label: 'EN',

    day: 'DAY',
    score: 'SCORE',
    served: 'SERVED',
    rep: 'REP',
    streak: 'STREAK',

    serve: 'SERVE',
    trash: 'TRASH',

    cup_label: 'CUP',
    espresso_label: 'ESPR',
    water_label: 'H2O',
    milk_label: 'MILK',
    foam_label: 'FOAM',
    choc_label: 'CHOC',
    whip_label: 'WHIP',
    caramel_label: 'CARM',

    drink_espresso: 'ESPRESSO',
    drink_americano: 'AMERICANO',
    drink_latte: 'LATTE',
    drink_cappuccino: 'CAPPUCCINO',
    drink_macchiato: 'MACCHIATO',
    drink_mocha: 'MOCHA',
    drink_hot_chocolate: 'HOT CHOC',
    drink_caramel_latte: 'CARAMEL LATTE',

    perfect: 'PERFECT!',
    good: 'GOOD!',
    ok: 'OK...',
    wrong: 'WRONG DRINK!',
    customer_left: 'CUSTOMER LEFT!',
    cup_empty: 'CUP IS EMPTY!',
    select_order: 'SELECT AN ORDER!',
    place_cup: 'PLACE CUP FIRST!',
    trash_first: 'TRASH CUP FIRST!',
    wait_dots: 'WAIT...',
    trashed: 'TRASHED',
    medium_cup: 'MEDIUM CUP',
    small_cup: 'SMALL CUP',
    large_cup: 'LARGE CUP',
    streak_text: 'STREAK x',
    rush_hour: 'RUSH HOUR!',

    click_cup: 'CLICK CUP TO START',
    waiting: 'WAITING FOR CUSTOMERS...',
    items_label: 'ITEMS',

    day_complete: 'DAY {} COMPLETE!',
    customers_label: 'CUSTOMERS:',
    perfect_label: 'PERFECT:',
    failed_label: 'FAILED:',
    earnings_label: 'EARNINGS:',
    tips_label: 'TIPS:',
    rep_label: 'REPUTATION:',
    best_streak: 'BEST STREAK:',
    new_drink_unlocked: 'NEW DRINK UNLOCKED!',
    rep_too_low: 'REPUTATION TOO LOW!',
    game_over_text: 'GAME OVER',
    click_continue: 'CLICK TO CONTINUE',

    game_over: 'GAME OVER',
    coffee_closed: 'YOUR COFFEE SHOP CLOSED!',
    days_survived: 'DAYS SURVIVED:',
    total_score: 'TOTAL SCORE:',
    total_money: 'TOTAL MONEY:',
    click_restart: 'CLICK TO RESTART',

    menu: 'MENU',

    pers_regular: 'CHILL',
    pers_hurry: 'IN A RUSH!',
    pers_vip: 'VIP GUEST',
    pers_friendly: 'FRIENDLY',

    comment_regular: 'HI THERE.',
    comment_hurry: 'QUICK PLEASE!',
    comment_vip: 'MAKE IT SPECIAL.',
    comment_friendly: 'NO RUSH, FRIEND!'
  },

  zh: {
    title: '咖啡调制师',
    subtitle: '咖啡店模拟器',
    click_start: '点击开始',
    instr1: '1. 点击订单选择顾客',
    instr2: '2. 放杯子，依次加原料',
    instr3: '3. 上餐！',
    lang_label: '中',

    day: '第',
    score: '得分',
    served: '已服务',
    rep: '声望',
    streak: '连击',

    serve: '上餐',
    trash: '丢弃',

    cup_label: '杯',
    espresso_label: '浓缩',
    water_label: '热水',
    milk_label: '牛奶',
    foam_label: '奶泡',
    choc_label: '巧克',
    whip_label: '奶油',
    caramel_label: '焦糖',

    drink_espresso: '浓缩咖啡',
    drink_americano: '美式',
    drink_latte: '拿铁',
    drink_cappuccino: '卡布奇诺',
    drink_macchiato: '玛奇朵',
    drink_mocha: '摩卡',
    drink_hot_chocolate: '热巧克力',
    drink_caramel_latte: '焦糖拿铁',

    perfect: '完美！',
    good: '不错！',
    ok: '一般...',
    wrong: '做错了！',
    customer_left: '顾客离开了！',
    cup_empty: '杯子是空的！',
    select_order: '请先选订单！',
    place_cup: '请先放杯子！',
    trash_first: '请先丢弃当前杯子！',
    wait_dots: '稍等...',
    trashed: '已丢弃',
    medium_cup: '中杯',
    small_cup: '小杯',
    large_cup: '大杯',
    streak_text: '连击 x',
    rush_hour: '高峰时段！',

    click_cup: '点击「杯」开始',
    waiting: '等待顾客中...',
    items_label: '种原料',

    day_complete: '第 {} 天完成！',
    customers_label: '顾客数：',
    perfect_label: '完美：',
    failed_label: '失败：',
    earnings_label: '收入：',
    tips_label: '小费：',
    rep_label: '声望：',
    best_streak: '最高连击：',
    new_drink_unlocked: '解锁新饮品！',
    rep_too_low: '声望太低了！',
    game_over_text: '游戏结束',
    click_continue: '点击继续',

    game_over: '游戏结束',
    coffee_closed: '你的咖啡店关门了！',
    days_survived: '坚持天数：',
    total_score: '总得分：',
    total_money: '总金额：',
    click_restart: '点击重启',

    menu: '菜单',

    pers_regular: '普通',
    pers_hurry: '赶时间！',
    pers_vip: '贵宾',
    pers_friendly: '友好',

    comment_regular: '你好。',
    comment_hurry: '请快一点！',
    comment_vip: '要做得特别哦。',
    comment_friendly: '不急，慢慢来！'
  }
};

function t(key, arg) {
  var s = (I18N[Lang] && I18N[Lang][key] !== undefined) ? I18N[Lang][key] :
          (I18N.en[key] !== undefined ? I18N.en[key] : key);
  if (arg !== undefined) s = s.replace('{}', arg);
  return s;
}

function setLang(lang) {
  if (!I18N[lang]) return;
  Lang = lang;
  try { localStorage.setItem('coffee_lang', lang); } catch (e) {}
}

function toggleLang() {
  setLang(Lang === 'zh' ? 'en' : 'zh');
}

function loadLang() {
  try {
    var saved = localStorage.getItem('coffee_lang');
    if (saved && I18N[saved]) Lang = saved;
  } catch (e) {}
}

function containsChinese(text) {
  return /[一-龥　-〿＀-￯]/.test(text);
}
