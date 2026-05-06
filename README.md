# Brew Craft ☕

> 2.5D 第一人称像素风咖啡店模拟器 / 2.5D first-person pixel art coffee shop simulator

[**▶ 在线试玩 / Play online**](https://nsc328-del.github.io/brew-craft/)

零依赖，纯 HTML5 Canvas + 原生 JavaScript。所有像素画通过代码绘制，所有音效通过 Web Audio API 实时生成 —— 没有任何外部图片或音频文件。

---

## 玩法 / Gameplay

你是一名站在吧台后方的咖啡师。顾客点单 → 选择对应订单 → 放杯子 → 依次添加原料 → 上餐。

- 配方正确 + 顺序对 = **完美 (¥¥¥ + 小费)**
- 原料齐但顺序错 = **不错 (¥¥)**
- 缺原料或多原料 = **一般 (¥)**
- 完全做错 = **失败 (扣声望)**

声望降到 0 = Game Over。

## 特性 / Features

- ☕ **8 种饮品**：浓缩、美式、拿铁、卡布奇诺、玛奇朵、摩卡、热巧克力、焦糖拿铁（按天解锁）
- 👥 **4 种顾客性格**：普通 / 赶时间 / VIP / 友好 —— 各有不同耐心、小费倍率和台词
- 🔥 **连击系统**：连续完美累积奖励
- ⚡ **高峰时段**：第 3 天起随机触发，更多顾客 + 更短耐心 + 更高小费
- 🌐 **中英双语**：右上角一键切换，偏好自动保存
- 🎵 **程序化音效**：Web Audio API 生成的咖啡机轰鸣、蒸汽嘶鸣、提示音

## 操作 / Controls

- **鼠标点击** / 触屏点击：选订单、加原料、上餐、丢弃
- 没有键盘操作，移动端也可玩

## 本地运行 / Run Locally

```bash
git clone https://github.com/nsc328-del/brew-craft.git
cd brew-craft
# 直接双击 index.html，或：
python3 -m http.server 8090
# 访问 http://localhost:8090/
```

## 项目结构 / Project Structure

```
brew-craft/
├── index.html
└── js/
    ├── i18n.js         # 中英文翻译表 + 切换逻辑
    ├── sprites.js      # 调色板、位图字体、所有像素画绘制
    ├── recipes.js      # 饮品配方 + 验证评分
    ├── state.js        # 游戏状态对象
    ├── orders.js       # 订单生成 + 顾客性格 + 连击
    ├── input.js        # 鼠标/触屏交互
    ├── ui.js           # 菜单、日结算、Game Over 画面
    ├── renderer.js     # 2.5D 吧台、设备、原料栏渲染
    ├── progression.js  # 日进度、解锁、高峰时段
    ├── audio.js        # Web Audio 程序化音效
    └── main.js         # 游戏循环 + 离屏 canvas 管线
```

## 技术 / Tech Notes

- 内部分辨率 320×240，CSS `image-rendering: pixelated` 实现像素完美缩放
- 所有精灵在初始化时预渲染到离屏 canvas，运行时只 blit
- 5×7 位图字体（英文）+ Canvas `fillText` + 等宽字体（中文）
- 30 FPS 目标帧率
- 偏好通过 `localStorage` 持久化

## License

MIT
