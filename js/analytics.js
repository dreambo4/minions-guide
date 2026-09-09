/* Google Analytics (GA4) 事件包裝
   把追蹤集中在這裡，app.js 只呼叫 track()。
   本機停用時（GA_DISABLED，見各頁 <head>）不送出，改印 debug log，
   方便在 localhost 確認埋點有沒有正確觸發、參數對不對。
   GA 被廣告攔截器擋掉時 gtag 不存在，track() 直接靜默返回，不影響網站功能。 */

const GA_MEASUREMENT_ID = 'G-FKX9XWTTRR';

function track(name, params) {
  if (window.GA_DISABLED) {
    console.debug('[GA] skipped event', name, params || {});
    return;
  }
  if (typeof gtag !== 'function') return;
  gtag('event', name, params || {});
}

/* 把四段零件狀態攤平成 GA 參數；combo 讓「哪些組合最常被拼出來」可以直接在報表分組 */
function comboParams(t) {
  return {
    eyes: t.eyes,
    hair: t.hair,
    height: t.height,
    girth: t.girth,
    combo: traitKey(t),
    combo_id: comboId(t),
    named: namedFor(t).map((c) => c.name).join('、') || '(未命名)'
  };
}
