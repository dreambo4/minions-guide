/* Minion SVG renderer + canonical trait data (Despicable Me Wiki taxonomy) */

const EYES = [
  { id: 'one', name: '單眼', short: '1', desc: '單顆眼球置中，配一體式圓形護目鏡' },
  { id: 'two', name: '雙眼', short: '2', desc: '兩顆眼球並列，護目鏡由鼻樑架連接' }
];

const HAIR = [
  { id: 'spiky',   name: '刺蝟頭', desc: '直立炸開的硬毛，長短皆算此類（Jorge、Otto 的短刺也是）' },
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
  { id: 'plump',   name: '圓胖', desc: '明顯加寬的圓滾滾身形，如 Otto、Ed' }
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

  /* 腿：從吊帶褲底往下長出 */
  /* 依劇照：腿短而寬、兩腿幾乎緊貼，靴子直接接在身體下方 */
  const legW = Math.round(r * 0.62);  /* 腿寬隨體型縮放，兩腿合計接近身寬 */
  const legGap = 3;                   /* 兩腿之間只留一條窄縫 */
  const legInner = legGap / 2;
  const legOuter = legGap / 2 + legW;
  const legLen = 9;                   /* 腿只露出極短一截 */
  const footY = bodyBottom + legLen + 1;
  /* 膠囊底面陰影的起點：從身體下段開始往下漸暗 */
  const shadeTop = bodyBottom - Math.round(g.h * 0.20);

  /* 手臂貼身、手套帶手指——依劇照量測，手臂自肩帶下方長出，手套底緣接近靴頂 */
  /* 劇照：手臂上端消失在斜肩帶底下（肩帶壓在手臂之上），可見段從肩帶「下方」才露出，
     上寬下窄收成細手腕。肩帶在身側的高度是 bibTop - 10，手臂連結處再往下一截 */
  const armTop = bibTop - 9;
  const gloveY = bodyBottom + legLen - 12;
  /* 手套 x 與手臂末端對齊，避免接縫露出黃色。
     外撇量隨體寬縮放：固定 +11 會讓體寬窄的高瘦型手臂斜度過陡，
     在褲腰處與身體邊緣夾出楔形空隙 */
  const gloveX = r + r * 0.13 + 3;
  /* 連指手套：袖口窄、手掌寬，下緣兩個圓弧手指；sd 直接乘進座標，不用 transform */
  const glove = (sd) => {
    const gx = cx + sd * gloveX;
    const y = gloveY;
    return `
  <path d="M${gx - 5.4} ${y - 6}
           L${gx + 5.4} ${y - 6}
           Q${gx + 6.6} ${y - 5.3}, ${gx + 6.8} ${y - 2.8}
           L${gx + 7} ${y + 2}
           Q${gx + 7.1} ${y + 5.3}, ${gx + 4.3} ${y + 6.2}
           Q${gx + 2.2} ${y + 9.2}, ${gx - 0.2} ${y + 8}
           Q${gx - 2.4} ${y + 10.8}, ${gx - 4.7} ${y + 7.9}
           Q${gx - 7} ${y + 6}, ${gx - 7} ${y + 2}
           L${gx - 6.8} ${y - 2.8}
           Q${gx - 6.6} ${y - 5.3}, ${gx - 5.4} ${y - 6} Z"
        fill="#17181C"/>`;
  };

  /* 手臂：上端埋進身體、被斜肩帶蓋住，露出的部分上寬下窄——
     肩處接近肩寬、往下收成細手腕再接進手套（依劇照量測） */
  const armLen = gloveY - armTop;
  const arm = (sd) => {
    const sx = cx + sd * (r - 11);        /* 可見段的貼身位置 */
    /* 埋入端另外再往內收：身體是上窄下寬的蛋型，埋入點在 armTop-hide 的高度
       身寬已經比 r 窄，若沿用 sx 會讓尖端戳出輪廓、在身側夾出楔形缺口 */
    const tx = cx + sd * (r - 20);
    const wx = cx + sd * gloveX;          /* 腕：對齊手套中心 */
    /* 依多張劇照（jerry_pair / rog_five 平舉手臂 / mel_march）量測：
       手臂直徑約為身寬的 1/7～1/8，比原本細很多 */
    const upperW = 5.2;                   /* 上臂半寬：略寬於腕，往下收窄 */
    const wristW = 4.4;                   /* 腕部收窄，接進手套袖口 */
    const hide = 34;                      /* 上端埋深進身體：尖端藏在輪廓內側，
                                             否則會頂在身體邊緣上、在交會處折出凹角 */
    const tipW = 2.6;                     /* 埋入端收尖，外緣不在肩帶上方頂出稜線 */
    const flare = r * 0.10 + 3.5;         /* 外緣往外撇；加常數項，體寬窄時也確實離開身體 */
    const yTopA = armTop - hide;
    return `
  <path d="M${tx - sd * tipW} ${yTopA}
           C${sx - sd * upperW} ${armTop + armLen * 0.28},
            ${wx - sd * (wristW + 2)} ${armTop + armLen * 0.72},
            ${wx - sd * wristW} ${gloveY + 2}
           L${wx + sd * wristW} ${gloveY + 2}
           C${wx + sd * (wristW + flare)} ${armTop + armLen * 0.70},
            ${sx + sd * (upperW + flare * 0.5)} ${armTop + armLen * 0.24},
            ${tx + sd * tipW} ${yTopA} Z"
        fill="${SKIN_SHADE}" stroke="#CBA132" stroke-width="1.5" stroke-linejoin="round"/>`;
  };

  /* 靴子：與腿同寬的鞋筒 + 略往外的圓鞋頭 */
  const bootCx = legGap / 2 + legW / 2; /* 靴子中心＝腿中心 */
  const boot = (sd) => `
  <g transform="rotate(${sd * 5} ${cx + sd * bootCx} ${footY - 8})">
    <rect x="${cx + sd * bootCx - legW / 2}" y="${footY - 9}"
          width="${legW}" height="12" rx="3.5" fill="#17181C"/>
    <ellipse cx="${cx + sd * (bootCx + 1.5)}" cy="${footY + 1}"
             rx="${legW / 2 + 2.5}" ry="6" fill="#17181C"/>
  </g>`;

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
    <!-- 膠囊底面轉折：正面往下轉成朝地的底面，越接近腿越暗 -->
    <linearGradient id="capsuleBottomG-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1428" stop-opacity="0"/>
      <stop offset="30%" stop-color="#0A1428" stop-opacity="0.12"/>
      <stop offset="62%" stop-color="#0A1428" stop-opacity="0.38"/>
      <stop offset="88%" stop-color="#0A1428" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#0A1428" stop-opacity="0.70"/>
    </linearGradient>
    <clipPath id="bodyClip-${uid}">
      <path d="${bodyPath}"/>
    </clipPath>
    <!-- 身體描邊改畫在吊帶褲「之上」（見下方繪製順序）：
         褲子被 bodyClip 裁到身體輪廓，邊緣正好壓在描邊上，
         畫在褲子之前會讓身側輪廓線整段被蓋掉（中等／矮胖最明顯）。
         這裡只把描邊裁在褲腰下方一點，收尾藏進褲子裡，不橫切過腿 -->
    <clipPath id="strokeClip-${uid}">
      <rect x="0" y="0" width="200" height="${pantsTop + 14}"/>
    </clipPath>

  </defs>

  <ellipse cx="${cx}" cy="${footY + 7}" rx="${legW + 16}" ry="4.5" fill="#17181C" opacity="0.13"/>

  <!-- 兩條腿：頂端深入身體內部（被後畫的身體蓋住），亮度與身體內的吊帶褲一致 -->
  <rect x="${cx - legOuter}" y="${bodyBottom - 40}" width="${legW}"
        height="${legLen + 40}" rx="${legW / 2}" fill="${DENIM}"/>
  <rect x="${cx + legInner}" y="${bodyBottom - 40}" width="${legW}"
        height="${legLen + 40}" rx="${legW / 2}" fill="${DENIM}"/>
  <!-- 用與身體同一條漸層延續暗化，讓交界完全看不出接縫 -->
  <rect x="${cx - legOuter}" y="${bodyTop}" width="${legW}"
        height="${bodyBottom - bodyTop + legLen}" rx="${legW / 2}" fill="url(#shadeG-${uid})"/>
  <rect x="${cx + legInner}" y="${bodyTop}" width="${legW}"
        height="${bodyBottom - bodyTop + legLen}" rx="${legW / 2}" fill="url(#shadeG-${uid})"/>

  <!-- 膠囊底面陰影（腿的部分）：與身體同一條漸層、同一 y 基準，交界處自然連續 -->
  <rect x="${cx - legOuter}" y="${shadeTop}" width="${legW}"
        height="${bodyBottom + legLen - shadeTop}" rx="${legW / 2}"
        fill="url(#capsuleBottomG-${uid})"/>
  <rect x="${cx + legInner}" y="${shadeTop}" width="${legW}"
        height="${bodyBottom + legLen - shadeTop}" rx="${legW / 2}"
        fill="url(#capsuleBottomG-${uid})"/>

  <!-- 腿位於膠囊底下、受身體遮蔽，整體再壓暗一階 -->
  <rect x="${cx - legOuter}" y="${bodyBottom - 40}" width="${legW}"
        height="${legLen + 40}" rx="${legW / 2}" fill="#0A1428" opacity="0.13"/>
  <rect x="${cx + legInner}" y="${bodyBottom - 40}" width="${legW}"
        height="${legLen + 40}" rx="${legW / 2}" fill="#0A1428" opacity="0.13"/>

  <!-- 靴子：厚實圓靴＋往外的鞋頭，略微外八 -->
  ${boot(-1)}${boot(1)}

  <!-- 手臂：填充造型，肩部深入身體內側，露出的部分自然從身側鼓出（無接縫） -->
  ${arm(-1)}${arm(1)}

  <!-- 蛋型身體 -->
  <path d="${bodyPath}" fill="url(#skinG-${uid})"/>
  <g clip-path="url(#bodyClip-${uid})">
    <!-- 護目鏡頭帶：整圈繞過身體 -->
    <rect x="${cx - r}" y="${eyeY - 7}" width="${g.w}" height="14" fill="#1A1C20"/>

    <!-- 吊帶褲 -->
    <rect x="${cx - r}" y="${pantsTop}" width="${g.w}" height="${bodyBottom - pantsTop + 4}" fill="${DENIM}"/>
    <rect x="${cx - bibW / 2}" y="${bibTop}" width="${bibW}" height="${pantsTop - bibTop + 6}" rx="9" fill="${DENIM}"/>
    <!-- 斜肩帶 -->
    <path d="M${cx - r + 3} ${bibTop - 10} L${cx - bibW / 2 - 1} ${bibTop + 4}"
          stroke="${DENIM}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${cx + r - 3} ${bibTop - 10} L${cx + bibW / 2 + 1} ${bibTop + 4}"
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
    <!-- 膠囊底面陰影（身體的部分）：正面往下轉成朝地的底面，越靠近腿越暗 -->
    <rect x="${cx - r}" y="${shadeTop}" width="${g.w}" height="${bodyBottom + legLen - shadeTop}"
          fill="url(#capsuleBottomG-${uid})"/>
    <!-- 頂光：上亮下暗 -->
    <rect x="${cx - r}" y="${bodyTop}" width="${g.w}" height="${g.h}" fill="url(#shadeG-${uid})"/>
  </g>

  <!-- 身體描邊：沿用 bodyPath 整條輪廓，畫在吊帶褲之上避免被褲子蓋掉，
       再裁掉褲腰以下的部分（不寫死結束 y，體型再矮也不會缺一段） -->
  <path d="${bodyPath}" clip-path="url(#strokeClip-${uid})"
        fill="none" stroke="#CBA132" stroke-width="1.5" stroke-linecap="round"/>

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
