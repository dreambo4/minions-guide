/* 產生 og-image.svg（社群分享預覽圖來源）
   用法：node tools/make-og.js
   再用 headless Chrome 轉成 og-image.png（1200x630）——多數社群平台不吃 SVG。 */

const fs = require('fs');
const P = '/Users/mis-macmini5/Project/minions_guide';
const src = (f) => fs.readFileSync(P + '/js/' + f, 'utf8');
global.__out = {};
eval(src('minion.js') + '\n;\n' + src('data.js') + `
;
global.__out.svgs = [
  renderMinion({eyes:'two',hair:'sprout',height:'tall',girth:'average'},
               (namedFor({eyes:'two',hair:'sprout',height:'tall',girth:'average'})[0]||{}).opts||{}),
  renderMinion({eyes:'one',hair:'combed',height:'medium',girth:'average'},
               (namedFor({eyes:'one',hair:'combed',height:'medium',girth:'average'})[0]||{}).opts||{}),
  renderMinion({eyes:'two',hair:'bald',height:'short',girth:'average'},
               (namedFor({eyes:'two',hair:'bald',height:'short',girth:'average'})[0]||{}).opts||{})
];
`);

// 取出每隻的內層內容（去掉外層 <svg> 殼），改用 <g transform> 併排
const inner = global.__out.svgs.map((s) =>
  s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));

// 1200x630：三隻並排。內容實際底部在 y=242（GROUND），非 viewBox 的 300，
// 故以 242 為基準算高度，讓三隻站在同一條地平線上且不留多餘底部空白。
const S = 1.42;
const GROUND_Y = 242;
const CONTENT_H = 300 * S;  // 用完整 viewBox 高度，腳與陰影都在 242~300 之間
const baseline = 600;              // 三隻共同的腳底 y
const y0 = baseline - CONTENT_H;

// 三隻等分水平空間（各佔 1/3 中心），避免因體寬不同而視覺偏移
const groups = inner.map((c, i) => {
  const cx = 1200 * (i + 0.5) / 3;
  const tx = cx - 100 * S;         // 100 = viewBox 中心 x
  return `<g transform="translate(${tx.toFixed(1)} ${y0.toFixed(1)}) scale(${S})">${c}</g>`;
}).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- 與工作台舞台區（css/style.css 的 .stage）相同：米白漸層 + 中下方黃色光暈 -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4F2EB"/><stop offset="1" stop-color="#E9E6DC"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.80" r="0.62">
      <stop offset="0" stop-color="#FFD849" stop-opacity="0.28"/>
      <stop offset="0.7" stop-color="#FFD849" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="92" text-anchor="middle" fill="#17181C"
        font-family="'Space Grotesk',Helvetica,Arial,sans-serif" font-size="54" font-weight="700">小小兵實驗室</text>
  <text x="600" y="140" text-anchor="middle" fill="#8A8E96"
        font-family="'Space Grotesk',Helvetica,Arial,sans-serif" font-size="26"
        letter-spacing="3">MINIONS GUIDE · 48 種排列組合</text>
${groups}
</svg>`;

fs.writeFileSync(P + '/og-image.svg', svg);
console.log('og-image.svg 已產生,', svg.length, 'bytes');
