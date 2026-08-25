# 小小兵實驗室 Minions Guide

小小兵（Minions）圖鑑＋排列組合產生器。純前端靜態網站，所有小小兵皆以 SVG 程式即時繪製。

**Live**: https://minions-guide-dreambo4.web.app

## 功能

- **組裝工作台**（`index.html`）：以「髮型 × 眼睛 × 身高 × 體型」四段切換零件組裝小小兵，附隨機生成；拼出電影登場角色時顯示名字、介紹與出場電影
- **圖鑑**（`dex.html`）：2 眼型 × 4 髮型 × 3 身高 × 2 體型＝48 種組合一覽，可篩選、點卡片看詳細檔案；收錄 15 位具名角色（Kevin、Stuart、Bob、Otto、Dave、Jerry、Mel、James…）

## 結構

- `js/minion.js` — SVG 繪圖器（幾何、比例與配色依電影劇照校正）
- `js/data.js` — 具名角色資料庫（組合對應、台譯名、出場電影）
- `js/app.js` — 工作台與圖鑑頁面邏輯
- `css/style.css` — 深色實驗室風格 UI

## 部署

Firebase Hosting，push 到 `main` 由 GitHub Actions 自動部署。

---

非官方粉絲作品。角色分類整理自 Despicable Me Wiki 等公開資料；《神偷奶爸》與《小小兵》系列版權屬 Illumination／Universal Pictures。
