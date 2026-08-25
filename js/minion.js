/* Minion SVG renderer + canonical trait data (Despicable Me Wiki taxonomy) */

const EYES = [
  { id: 'one', name: '單眼', short: '1', desc: '單顆眼球置中，配一體式圓形護目鏡' },
  { id: 'two', name: '雙眼', short: '2', desc: '兩顆眼球並列，護目鏡由鼻樑架連接' }
];

const HAIR = [
  { id: 'spiky',   name: '刺蝟頭', desc: '直立炸開的硬毛，長短皆算此類（Jerry、Jorge 的短刺也是）' },
  { id: 'sprout',  name: '呆毛',   desc: '頭頂正中一撮翹起的細毛' },
  { id: 'combed',  name: '中分',   desc: '服貼向兩側分邊的細髮' },
  { id: 'bald',    name: '光頭',   desc: '頭頂全禿，一根不留' }
];

const HEIGHT = [
  { id: 'short',  name: '矮', desc: '最矮的膠囊比例，如 Bob' },
  { id: 'medium', name: '中等', desc: '最常見的標準身高，如 Stuart、Dave' },
  { id: 'tall',   name: '高', desc: '拉長的身形，如 Kevin' }
];

const GIRTH = [
  { id: 'average', name: '標準', desc: '標準寬度的膠囊身形' },
  { id: 'plump',   name: '圓胖', desc: '明顯加寬的圓滾滾身形，如 Otto、Jerry、Jorge' }
];

/* 幾何：以 viewBox 0 0 200 300 為基準；所有身形共用同一條地面線，高矮差在頭頂 */
const HEIGHT_GEO = { short: 118, medium: 164, tall: 216 };
/* 寬度同時受體型與身高影響（劇照量測：Stuart 中等最寬、Kevin 高而窄、Bob 矮但接近中等寬） */
const WIDTH_GEO = {
  average: { short: 86,  medium: 94,  tall: 80 },
  plump:   { short: 106, medium: 120, tall: 104 }
};
const GROUND = 242; /* 身體底部 y */

const SKIN = '#F7D354';
const SKIN_SHADE = '#DFB43C';
const DENIM = '#4E70A2';
const DENIM_DARK = '#3A557E';
const STEEL = '#C7CDD6';
const STEEL_DARK = '#8A93A0';
const HAIR_COLOR = '#17181C';
const IRIS_BROWN = '#5C3A1E';

/* 每次繪製給獨一無二的 id 流水號：
   同一組合可能同時出現在多處（工作台、圖鑑卡、彈窗），
   漸層 id 重複時瀏覽器只認文件裡第一個，若它藏在 display:none 裡填色會直接失效 */
let MINION_SEQ = 0;

function hairMarkup(hair, cx, topY) {
  switch (hair) {
    case 'bald':
      return '';
    case 'sprout':
      return `<path d="M${cx - 1} ${topY + 3} C ${cx - 2} ${topY - 8}, ${cx - 6} ${topY - 12}, ${cx - 10} ${topY - 10}"
                 stroke="${HAIR_COLOR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <path d="M${cx} ${topY + 3} C ${cx + 1} ${topY - 10}, ${cx + 5} ${topY - 14}, ${cx + 9} ${topY - 12}"
                 stroke="${HAIR_COLOR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'combed':
      return [0, 1, 2].map((i) => {
        const sy = topY + 3 + i * 2.2;
        const spread = 14 + i * 5;
        const drop = 2 + i * 2;
        return `<path d="M${cx} ${sy} C ${cx - 7} ${sy - 4}, ${cx - spread + 5} ${sy - 3}, ${cx - spread} ${sy + drop}"
                 stroke="${HAIR_COLOR}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                <path d="M${cx} ${sy} C ${cx + 7} ${sy - 4}, ${cx + spread - 5} ${sy - 3}, ${cx + spread} ${sy + drop}"
                 stroke="${HAIR_COLOR}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      }).join('');
    case 'bald':
      return '';
    case 'sprout':
      return `<path d="M${cx - 1} ${topY + 3} C ${cx - 3} ${topY - 9}, ${cx - 9} ${topY - 14}, ${cx - 15} ${topY - 11}"
                 stroke="${HAIR_COLOR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <path d="M${cx} ${topY + 3} C ${cx + 1} ${topY - 12}, ${cx + 7} ${topY - 17}, ${cx + 14} ${topY - 13}"
                 stroke="${HAIR_COLOR}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <path d="M${cx + 1} ${topY + 3} C ${cx + 3} ${topY - 6}, ${cx + 6} ${topY - 8}, ${cx + 10} ${topY - 6}"
                 stroke="${HAIR_COLOR}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    case 'spiky':
      return [-26, -13, 0, 13, 26].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = cx + Math.sin(rad) * 16;
        const y1 = topY + 3 - Math.cos(rad) * 4;
        const x2 = cx + Math.sin(rad) * 30;
        const y2 = topY - 20 - Math.cos(rad) * 6;
        return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${HAIR_COLOR}" stroke-width="2.6" stroke-linecap="round"/>`;
      }).join('');
    case 'combed':
      return [0, 1, 2].map((i) => {
        const sy = topY + 2 + i * 1.2;
        const spread = 30 - i * 5;
        const drop = 12 - i * 3;
        return `<path d="M${cx} ${sy} C ${cx - 12} ${sy - 8 + i}, ${cx - spread + 6} ${sy - 2}, ${cx - spread} ${sy + drop}"
                 stroke="${HAIR_COLOR}" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M${cx} ${sy} C ${cx + 12} ${sy - 8 + i}, ${cx + spread - 6} ${sy - 2}, ${cx + spread} ${sy + drop}"
                 stroke="${HAIR_COLOR}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      }).join('');
    default:
      return '';
  }
}

/* irises：虹膜顏色，一顆眼取 [0]，兩顆眼取 [左, 右]（Bob 的異色瞳用）
   uid：取用該 SVG defs 內的金屬框漸層 */
function eyeMarkup(eyes, cx, eyeY, pupilDir, irises, uid) {
  const dx = pupilDir?.x ?? 0;
  const dy = pupilDir?.y ?? 0;
  const ir = irises || [];
  const lens = (ox, rimR, iris) => {
    const eyeR = rimR - 4;
    const irisR = rimR * 0.30;
    const pupR = irisR * 0.52;
    return `
      <circle cx="${cx + ox}" cy="${eyeY}" r="${rimR}" fill="url(#rimG-${uid})" stroke="#5F666E" stroke-width="1.4"/>
      <circle cx="${cx + ox}" cy="${eyeY}" r="${eyeR}" fill="#FFFFFF"/>
      <path d="M${cx + ox - eyeR} ${eyeY} a ${eyeR} ${eyeR} 0 0 1 ${eyeR * 2} 0"
            fill="none" stroke="#B9BEC6" stroke-width="1.6" opacity="0.5"/>
      <circle cx="${cx + ox + dx * 4}" cy="${eyeY + dy * 4}" r="${irisR}" fill="${iris}"/>
      <circle cx="${cx + ox + dx * 4}" cy="${eyeY + dy * 4}" r="${irisR}" fill="none" stroke="#3E2812" stroke-width="1" opacity="0.55"/>
      <circle cx="${cx + ox + dx * 4}" cy="${eyeY + dy * 4}" r="${pupR}" fill="#101216"/>
      <circle cx="${cx + ox + dx * 4 - irisR * 0.32}" cy="${eyeY + dy * 4 - irisR * 0.38}" r="${irisR * 0.22}" fill="#FFFFFF" opacity="0.92"/>`;
  };
  if (eyes === 'one') {
    return lens(0, 24.5, ir[0] || IRIS_BROWN);
  }
  const rimR = 18.5;
  return lens(-18, rimR, ir[0] || IRIS_BROWN) + lens(18, rimR, ir[1] || IRIS_BROWN);
}

/* Otto 專屬：張嘴大笑 + 加大版金屬牙套 */
function bracesMouth(cx, mouthY) {
  return `
    <path d="M${cx - 19} ${mouthY - 1} Q ${cx} ${mouthY + 24}, ${cx + 19} ${mouthY - 1} Z" fill="#4A2E14"/>
    <path d="M${cx - 16} ${mouthY} h32 v5.5 a3.5 3.5 0 0 1 -3.5 3.5 h-25 a3.5 3.5 0 0 1 -3.5 -3.5 Z" fill="#FFFFFF"/>
    <line x1="${cx - 15}" y1="${mouthY + 4.8}" x2="${cx + 15}" y2="${mouthY + 4.8}"
          stroke="${STEEL_DARK}" stroke-width="2"/>
    ${[-12, -6, 0, 6, 12].map((ox) =>
      `<rect x="${cx + ox - 1.6}" y="${mouthY + 3.2}" width="3.2" height="3.4" fill="${STEEL_DARK}"/>`
    ).join('')}`;
}

/**
 * 產生一隻小小兵的 SVG 字串
 * @param {{eyes:string,hair:string,height:string,girth:string}} t 特徵組合
 * @param {{mouth?:string, pupil?:{x:number,y:number}, irises?:string[]}} [opts]
 *        mouth: 'smile' | 'flat' | 'braces'
 */
function renderMinion(t, opts = {}) {
  const g = {
    w: (WIDTH_GEO[t.girth] || WIDTH_GEO.average)[t.height] || 94,
    h: HEIGHT_GEO[t.height] || HEIGHT_GEO.medium
  };
  const cx = 100;
  const r = g.w / 2;
  const bodyBottom = GROUND;
  const bodyTop = bodyBottom - g.h;

  /* 蛋型輪廓：非常輕微的下寬上窄（劇照的蛋型只差一點點）——頭頂圓弧僅縮 6% */
  const rb = r;
  const rt = r * 0.94;
  const yTop = bodyTop + rt;
  const yBot = bodyBottom - rb;
  const span = yBot - yTop;
  const bodyPath =
    `M ${cx - rb} ${yBot}` +
    ` A ${rb} ${rb} 0 0 0 ${cx + rb} ${yBot}` +
    ` C ${cx + rb} ${yBot - span * 0.55}, ${cx + rt} ${yTop + span * 0.30}, ${cx + rt} ${yTop}` +
    ` A ${rt} ${rt} 0 0 0 ${cx - rt} ${yTop}` +
    ` C ${cx - rt} ${yTop + span * 0.30}, ${cx - rb} ${yBot - span * 0.55}, ${cx - rb} ${yBot} Z`;

  /* 依劇照：鏡片「上緣」離頭頂的距離按身高型固定（矮者護目鏡貼近頭頂、高者額頭較長），
     再由鏡片半徑推回眼睛中心，單眼／雙眼共用同一額頭留白 */
  const GAP_FRAC = { short: 0.09, medium: 0.11, tall: 0.15 };
  const lensR = t.eyes === 'one' ? 24.5 : 18.5;
  const eyeY = bodyTop + Math.round(g.h * (GAP_FRAC[t.height] || 0.11)) + lensR;
  const mouthY = eyeY + lensR + 7;
  /* 吊帶褲覆蓋下段約 25% 身高，前擋布再往上約 10.5% */
  const pantsTop = bodyBottom - Math.round(g.h * 0.25);
  const bibW = Math.round(g.w * 0.52);
  const bibTop = pantsTop - Math.round(g.h * 0.105);
  const pocketW = Math.round(bibW * 0.64);
  const mouth = opts.mouth || 'smile';
  const uid = `${t.height}-${t.girth}-${t.eyes}-${t.hair}-${MINION_SEQ++}`;

  let mouthPath;
  if (mouth === 'braces') {
    mouthPath = bracesMouth(cx, mouthY);
  } else if (mouth === 'flat') {
    mouthPath = `<path d="M${cx - 13} ${mouthY + 2} L${cx + 13} ${mouthY + 2}"
         stroke="#8A5E1E" stroke-width="2" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M${cx - 13} ${mouthY + 3.6} L${cx + 13} ${mouthY + 3.6}"
         stroke="#FFF3BE" stroke-width="1.3" opacity="0.4" fill="none" stroke-linecap="round"/>`;
  } else {
    mouthPath = `<path d="M${cx - 17} ${mouthY - 2} Q ${cx} ${mouthY + 10}, ${cx + 17} ${mouthY - 2}"
         stroke="#8A5E1E" stroke-width="2" opacity="0.5" fill="none" stroke-linecap="round"/>
      <path d="M${cx - 16} ${mouthY - 0.5} Q ${cx} ${mouthY + 11.5}, ${cx + 16} ${mouthY - 0.5}"
         stroke="#FFF3BE" stroke-width="1.3" opacity="0.4" fill="none" stroke-linecap="round"/>`;
  }

  /* 手臂貼身、手套帶手指 */
  const armTop = bibTop - 6;
  const gloveY = pantsTop + 10;
  const gloveX = r + 1;
  const glove = (s) => `
  <circle cx="${cx + s * gloveX}" cy="${gloveY}" r="7" fill="#17181C"/>
  <circle cx="${cx + s * (gloveX + 4.5)}" cy="${gloveY + 3.5}" r="3.4" fill="#17181C"/>
  <circle cx="${cx + s * (gloveX + 1.5)}" cy="${gloveY + 7}" r="3.4" fill="#17181C"/>`;

  return `
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" class="minion-svg" role="img">
  <defs>
    <linearGradient id="skinG-${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${SKIN_SHADE}"/>
      <stop offset="22%" stop-color="${SKIN}"/>
      <stop offset="80%" stop-color="${SKIN}"/>
      <stop offset="100%" stop-color="${SKIN_SHADE}"/>
    </linearGradient>
    <linearGradient id="rimG-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#EBEEF2"/>
      <stop offset="55%" stop-color="#C2C8CF"/>
      <stop offset="100%" stop-color="#8F979F"/>
    </linearGradient>
    <linearGradient id="shadeG-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="70%" stop-color="#8A5E0A" stop-opacity="0"/>
      <stop offset="100%" stop-color="#8A5E0A" stop-opacity="0.20"/>
    </linearGradient>
    <clipPath id="bodyClip-${uid}">
      <path d="${bodyPath}"/>
    </clipPath>
  </defs>

  <ellipse cx="${cx}" cy="${bodyBottom + 17}" rx="${r * 0.9}" ry="5" fill="#17181C" opacity="0.12"/>

  <!-- 寬鬆褲管與小圓靴 -->
  <rect x="${cx - 26}" y="${bodyBottom - 8}" width="23" height="16" rx="5" fill="${DENIM}"/>
  <rect x="${cx + 3}"  y="${bodyBottom - 8}" width="23" height="16" rx="5" fill="${DENIM}"/>
  <rect x="${cx - 26}" y="${bodyBottom + 4}" width="23" height="4" rx="2" fill="${DENIM_DARK}" opacity="0.55"/>
  <rect x="${cx + 3}"  y="${bodyBottom + 4}" width="23" height="4" rx="2" fill="${DENIM_DARK}" opacity="0.55"/>
  <rect x="${cx - 28}" y="${bodyBottom + 7}" width="26" height="9" rx="4.5" fill="#17181C"/>
  <rect x="${cx + 2}"  y="${bodyBottom + 7}" width="26" height="9" rx="4.5" fill="#17181C"/>

  <!-- 手臂：貼著身側垂下 -->
  <path d="M${cx - r + 3} ${armTop} q -10 ${(gloveY - armTop) * 0.5}, -5 ${gloveY - armTop}"
        stroke="${SKIN_SHADE}" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M${cx + r - 3} ${armTop} q 10 ${(gloveY - armTop) * 0.5}, 5 ${gloveY - armTop}"
        stroke="${SKIN_SHADE}" stroke-width="11" fill="none" stroke-linecap="round"/>

  <!-- 蛋型身體 -->
  <path d="${bodyPath}" fill="url(#skinG-${uid})" stroke="#CBA132" stroke-width="1.5"/>

  <g clip-path="url(#bodyClip-${uid})">
    <!-- 護目鏡頭帶：整圈繞過身體 -->
    <rect x="${cx - r}" y="${eyeY - 7}" width="${g.w}" height="14" fill="#1A1C20"/>

    <!-- 吊帶褲 -->
    <rect x="${cx - r}" y="${pantsTop}" width="${g.w}" height="${bodyBottom - pantsTop + 4}" fill="${DENIM}"/>
    <rect x="${cx - bibW / 2}" y="${bibTop}" width="${bibW}" height="${pantsTop - bibTop + 6}" rx="6" fill="${DENIM}"/>
    <!-- 斜肩帶 -->
    <path d="M${cx - r - 2} ${bibTop - 12} L${cx - bibW / 2 + 5} ${bibTop + 5}"
          stroke="${DENIM}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${cx + r + 2} ${bibTop - 12} L${cx + bibW / 2 - 5} ${bibTop + 5}"
          stroke="${DENIM}" stroke-width="8" stroke-linecap="round"/>
    <!-- 鈕扣 -->
    <circle cx="${cx - bibW / 2 + 6}" cy="${bibTop + 6}" r="3.2" fill="#17181C"/>
    <circle cx="${cx + bibW / 2 - 6}" cy="${bibTop + 6}" r="3.2" fill="#17181C"/>
    <!-- 車縫線 -->
    <path d="M${cx - bibW / 2 + 4} ${pantsTop + 8} v${bodyBottom - pantsTop - 8} M${cx + bibW / 2 - 4} ${pantsTop + 8} v${bodyBottom - pantsTop - 8}"
          stroke="${DENIM_DARK}" stroke-width="1.6" opacity="0.6"/>
    <!-- 口袋 + G logo -->
    <rect x="${cx - pocketW / 2}" y="${bibTop + 9}" width="${pocketW}" height="21" rx="4.5" fill="${DENIM_DARK}" opacity="0.85"/>
    <circle cx="${cx}" cy="${bibTop + 19.5}" r="6.6" fill="none" stroke="#AECBEF" stroke-width="1.8"/>
    <path d="M${cx + 3.6} ${bibTop + 16.4} a 4.2 4.2 0 1 0 0.5 5 h -2.9"
          fill="none" stroke="#AECBEF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- 頂光：上亮下暗 -->
    <rect x="${cx - r}" y="${bodyTop}" width="${g.w}" height="${g.h}" fill="url(#shadeG-${uid})"/>
  </g>

  <!-- 手套（帶手指） -->
  ${glove(-1)}${glove(1)}

  ${eyeMarkup(t.eyes, cx, eyeY, opts.pupil, opts.irises, uid)}
  ${mouthPath}
  ${hairMarkup(t.hair, cx, bodyTop)}
</svg>`;
}

/* 全部排列組合：2 眼睛 × 4 髮型 × 3 身高 × 2 體型 = 48（分類整理自 Despicable Me Wiki） */
function allCombos() {
  const out = [];
  EYES.forEach((e) => HAIR.forEach((h) => HEIGHT.forEach((ht) => GIRTH.forEach((gi) => {
    out.push({ eyes: e.id, hair: h.id, height: ht.id, girth: gi.id });
  }))));
  return out;
}

function comboId(t) {
  const ei = EYES.findIndex((x) => x.id === t.eyes);
  const hi = HAIR.findIndex((x) => x.id === t.hair);
  const hti = HEIGHT.findIndex((x) => x.id === t.height);
  const gii = GIRTH.findIndex((x) => x.id === t.girth);
  return ei * (HAIR.length * HEIGHT.length * GIRTH.length)
       + hi * (HEIGHT.length * GIRTH.length)
       + hti * GIRTH.length + gii + 1;
}
