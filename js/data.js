/* 具名小小兵資料：組合 key = `${eyes}-${hair}-${height}-${girth}` */

const MOVIES = {
  dm1:     '神偷奶爸（2010）',
  dm2:     '神偷奶爸2（2013）',
  minions: '小小兵（2015）',
  dm3:     '神偷奶爸3（2017）',
  rog:     '小小兵2：格魯的崛起（2022）',
  dm4:     '神偷奶爸4（2024）',
  mm:      '小小兵&大怪獸（2026）'
};

/* 同一種組合可能對到多位角色（小小兵本來就是「同款複製人」） */
const NAMED = [
  {
    key: 'two-sprout-tall-average', name: 'Kevin', zh: '凱文',
    movies: ['dm1', 'dm2', 'minions', 'dm3', 'rog', 'dm4'],
    note: '《小小兵》主角三人組的老大，高瘦身形配呆毛，冷靜可靠，帶隊尋找史上最強壞蛋老闆。'
  },
  {
    key: 'two-sprout-tall-average', name: 'Tim', zh: '提姆',
    movies: ['dm2', 'dm4'],
    note: '撲克臉擔當；《神偷奶爸2》裡曾戴假髮扮成「爸爸」混進百貨公司。'
  },
  {
    key: 'one-combed-medium-average', name: 'Stuart', zh: '史都華',
    movies: ['dm1', 'dm2', 'minions', 'dm3', 'rog', 'dm4'],
    note: '單眼吉他手，愛耍帥又貪吃，把香蕉看得比什麼都重要。'
  },
  {
    key: 'two-bald-short-average', name: 'Bob', zh: '蘿蔔',
    movies: ['dm2', 'minions', 'dm3', 'rog', 'dm4'],
    note: '天真爛漫的小弟，異色瞳（一綠一棕，官方認證的獨一無二手工特例），走到哪都抱著玩具熊 Tim，曾意外當上英國國王。',
    opts: { irises: ['#7A9B3E', '#5C3A1E'] }
  },
  {
    key: 'two-spiky-medium-plump', name: 'Otto', zh: '奧圖',
    movies: ['rog', 'dm4'],
    note: '《小小兵2》新成員，圓滾滾的身形配一頭炸開的短刺，戴著大牙套、話匣子關不住，曾把重要石板換成一顆「寵物石頭」。',
    opts: { mouth: 'braces' }
  },
  {
    key: 'two-combed-medium-average', name: 'Dave', zh: '戴夫',
    movies: ['dm1', 'dm2', 'minions', 'dm3', 'dm4'],
    note: '系列常駐班底，愛玩火箭砲、感情豐富，是最常被鏡頭帶到的小小兵之一。'
  },
  {
    key: 'two-combed-medium-average', name: 'Mark', zh: '馬克',
    movies: ['dm2'],
    note: '《神偷奶爸2》裡穿洋裝扮成「媽媽」、高唱 Underwear 版 YMCA 的那位。'
  },
  {
    key: 'two-sprout-tall-average', name: 'Jerry', zh: '傑瑞',
    movies: ['dm2', 'dm4'],
    note: '高瘦身形配頭頂呆毛，膽小但戲很多；曾和 Kevin 一起留守看家，還拿吸塵器互相追逐。'
  },
  {
    key: 'two-spiky-medium-average', name: 'Jorge', zh: '喬治',
    movies: ['dm1'],
    note: '《神偷奶爸》開場被格魯點名的成員之一；標準身材配刺蝟頭（雙眼＋中等＋標準＋刺蝟頭）。'
  },
  {
    key: 'two-spiky-medium-average', name: 'Phil', zh: '菲爾',
    movies: ['dm2'],
    note: '《神偷奶爸2》裡穿女僕裝認真打掃的那位，敬業程度百分之兩百。（「Phil」這名字在各集掛過不同隻小小兵，此處取最知名的女僕版）'
  },
  {
    key: 'one-spiky-medium-average', name: 'Carl', zh: '卡爾',
    movies: ['dm2', 'minions'],
    note: 'BEE-DO！BEE-DO！頂著警報器滅火的單眼消防員。'
  },
  {
    key: 'one-combed-medium-average', name: 'Mel', zh: '梅爾',
    movies: ['dm3', 'dm4'],
    note: '《神偷奶爸3》裡帶頭罷工出走的頭頭，因為格魯不肯繼續當壞蛋而率眾離家。'
  },
  {
    key: 'one-sprout-medium-average', name: 'James', zh: '詹姆斯',
    movies: ['mm'],
    note: '《小小兵&大怪獸》主角，滿腦子導演夢的單眼小小兵，藍色眼珠、頭頂一撮呆毛，一心想拍出怪獸大片。',
    opts: { irises: ['#4A7FBF'] }
  },
  {
    key: 'two-combed-medium-average', name: 'Henry', zh: '亨利',
    movies: ['mm'],
    note: '《小小兵&大怪獸》三人組之一，藍眼珠配波浪捲髮，和 James、Ed 一起闖進 1920 年代的好萊塢。',
    opts: { irises: ['#4A7FBF', '#4A7FBF'] }
  },
  {
    key: 'two-spiky-tall-plump', name: 'Ed', zh: '艾德',
    movies: ['mm'],
    note: '《小小兵&大怪獸》三人組裡最高大的一隻，圓壯身形配一頭往上抓的龐克髮；官方設定為聽障，以手語溝通。'
  }
];

const NAMED_BY_KEY = NAMED.reduce((m, c) => {
  (m[c.key] = m[c.key] || []).push(c);
  return m;
}, {});

function traitKey(t) { return `${t.eyes}-${t.hair}-${t.height}-${t.girth}`; }
function namedFor(t) { return NAMED_BY_KEY[traitKey(t)] || []; }
