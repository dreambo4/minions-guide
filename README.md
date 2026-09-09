# 小小兵實驗室 Minions Guide

小小兵（Minions）圖鑑＋排列組合產生器。純前端靜態網站，所有小小兵皆以 SVG 程式即時繪製。

**Live**: https://minions-guide-74f86.web.app

## 功能

- **組裝工作台**（`index.html`）：以「髮型 × 眼睛 × 身高 × 體型」四段切換零件組裝小小兵，附隨機生成；拼出電影登場角色時顯示名字、介紹與出場電影
- **圖鑑**（`dex.html`）：2 眼型 × 4 髮型 × 3 身高 × 2 體型＝48 種組合一覽，可篩選、點卡片看詳細檔案；收錄 15 位具名角色（Kevin、Stuart、Bob、Otto、Dave、Jerry、Mel、James…）

## 結構

- `js/minion.js` — SVG 繪圖器（幾何、比例與配色依電影劇照校正）
- `js/data.js` — 具名角色資料庫（組合對應、台譯名、出場電影）
- `js/app.js` — 工作台與圖鑑頁面邏輯
- `js/analytics.js` — GA4 事件包裝（`track()`）
- `css/style.css` — 深色實驗室風格 UI

## 部署

Firebase Hosting，push 到 `main` 由 GitHub Actions 自動部署。

## 數據追蹤（GA4）

Measurement ID：`G-FKX9XWTTRR`

**本機測試一律不記錄 GA。** 每個 HTML 在載入 gtag 之前先判斷 `location.hostname`，符合下列任一條件就完全不載入 GA script（連請求都不會發出），並設 `window.GA_DISABLED = true`：

- `localhost`、`127.0.0.1`、`[::1]`、`*.local`
- 私有網段 `192.168.*`、`10.*`、`172.16~31.*`、`169.254.*`（手機連區網 IP 測試也擋掉）
- `file://` 直接開檔
- 帶非標準 port（不是 80／443）——本機 server 幾乎都會帶 port，這條可涵蓋沒列到的網段

**新增頁面時比照辦理**：直接從 `index.html` 複製 `<!-- Google Analytics (GA4) -->` 整段到新頁的 `<head>`，不要改回原本的 `<script async src="...gtag/js">` 同步寫法，否則本機測試會污染正式數據。

### 本機的 debug log

本機停用時 `js/analytics.js` 的 `track()` 不是靜默返回，而是印出**本來會送出的事件**：

```
[GA] disabled on localhost
[GA] skipped event trait_change {trait: "hair", value: "spiky", eyes: "two", ...}
```

用意是在 localhost 就能確認埋點有沒有觸發、參數對不對——沒有這行 log，埋點壞掉（例如被同名函式蓋掉變成 no-op）只會表現為「GA 後台少了資料」，很難察覺。Console 需開啟 Verbose／Debug 層級才看得到 `console.debug`。

驗證：本機開啟時 Console 印 `[GA] disabled on <hostname>`，操作 UI 會逐筆印出 skipped event，且 Network 面板搜尋 `gtag` 為 0 筆；正式站則相反——有 gtag 請求、沒有這些 log。

---

非官方粉絲作品。角色分類整理自 Despicable Me Wiki 等公開資料；《神偷奶爸》與《小小兵》系列版權屬 Illumination／Universal Pictures。
