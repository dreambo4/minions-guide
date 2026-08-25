/* 頁面邏輯：依 DOM 判斷目前在工作台還是圖鑑（兩者可共存於同一頁） */

/* ---------- 共用 ---------- */

function movieList(ids) {
  return ids.map((id) => MOVIES[id]).join('、');
}

function matchCardsHTML(t) {
  const found = namedFor(t);
  if (!found.length) {
    return `<div class="match-none">
      這個組合還沒有官方名字——它是全宇宙一萬多隻小小兵裡的無名英雄。
      換個零件說不定就拼出電影角色了！
    </div>`;
  }
  return found.map((c) => `
    <div class="match">
      <div class="mtag">電影登場角色</div>
      <div class="mname">${c.name}</div>
      <div class="mzh">${c.zh}</div>
      <div class="mnote">${c.note}</div>
      <div class="mfilms">出場電影：<b>${movieList(c.movies)}</b></div>
    </div>`).join('');
}

/* 具名角色的專屬造型（Bob 異色瞳、Otto 牙套、James/Henry 藍眼珠） */
function comboOpts(t) {
  const found = namedFor(t);
  return (found.find((c) => c.opts) || {}).opts || {};
}

/* ---------- 組裝工作台 ---------- */

function initBuilder() {
  const stage = document.getElementById('stage');
  if (!stage) return;

  const layer = document.getElementById('minion-layer');
  const state = { eyes: 'two', hair: 'sprout', height: 'tall', girth: 'average' }; // 預設 Kevin
  const LISTS = { eyes: EYES, hair: HAIR, height: HEIGHT, girth: GIRTH };

  function render() {
    layer.innerHTML = renderMinion(state, comboOpts(state));
    document.getElementById('val-eyes').textContent = LISTS.eyes.find((x) => x.id === state.eyes).name;
    document.getElementById('val-hair').textContent = LISTS.hair.find((x) => x.id === state.hair).name;
    document.getElementById('val-height').textContent = LISTS.height.find((x) => x.id === state.height).name;
    document.getElementById('val-girth').textContent = LISTS.girth.find((x) => x.id === state.girth).name;
    document.getElementById('combo-id').textContent =
      `No.${String(comboId(state)).padStart(2, '0')} / 48`;
    ['eyes', 'hair', 'height', 'girth'].forEach((k) => {
      const item = LISTS[k].find((x) => x.id === state[k]);
      document.getElementById(`spec-${k}`).textContent = item.name;
      document.getElementById(`spec-${k}-d`).textContent = item.desc;
    });
    document.getElementById('match-area').innerHTML = matchCardsHTML(state);
  }

  stage.querySelectorAll('.arrow').forEach((btn) => {
    btn.addEventListener('click', () => {
      const trait = btn.dataset.trait;
      const list = LISTS[trait];
      const dir = Number(btn.dataset.dir);
      const i = list.findIndex((x) => x.id === state[trait]);
      state[trait] = list[(i + dir + list.length) % list.length].id;
      render();
    });
  });

  document.getElementById('btn-random').addEventListener('click', () => {
    const pick = (list) => list[Math.floor(Math.random() * list.length)].id;
    state.eyes = pick(EYES);
    state.hair = pick(HAIR);
    state.height = pick(HEIGHT);
    state.girth = pick(GIRTH);
    stage.classList.remove('shuffling');
    void stage.offsetWidth; /* 重新觸發動畫 */
    stage.classList.add('shuffling');
    render();
  });

  render();
}

/* ---------- 圖鑑 ---------- */

function initDex() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  const combos = allCombos().sort((a, b) => comboId(a) - comboId(b));
  const filter = { eyes: 'all', hair: 'all', height: 'all', girth: 'all', named: false };

  function cardHTML(t) {
    const found = namedFor(t);
    const no = String(comboId(t)).padStart(2, '0');
    const names = found.map((c) => c.name).join('、');
    const films = found.length
      ? [...new Set(found.flatMap((c) => c.movies))].map((id) => MOVIES[id].replace(/（\d+）/, '')).join('、')
      : '';
    const meta = [
      EYES.find((x) => x.id === t.eyes).name,
      HAIR.find((x) => x.id === t.hair).name,
      HEIGHT.find((x) => x.id === t.height).name,
      GIRTH.find((x) => x.id === t.girth).name
    ].join(' · ');
    return `
      <button class="card${found.length ? ' named' : ''}" data-key="${traitKey(t)}">
        <span class="no">No.${no}</span>
        ${found.length ? '<span class="badge">具名</span>' : ''}
        ${renderMinion(t, comboOpts(t))}
        <div class="cinfo">
          <div class="cname">${found.length ? names : '未命名'}</div>
          <div class="cmeta">${meta}</div>
          ${films ? `<div class="cfilm">${films}</div>` : ''}
        </div>
      </button>`;
  }

  function apply() {
    let shown = 0;
    grid.querySelectorAll('.card').forEach((card) => {
      const [eyes, hair, height, girth] = card.dataset.key.split('-');
      const named = card.classList.contains('named');
      const ok =
        (filter.eyes === 'all' || filter.eyes === eyes) &&
        (filter.hair === 'all' || filter.hair === hair) &&
        (filter.height === 'all' || filter.height === height) &&
        (filter.girth === 'all' || filter.girth === girth) &&
        (!filter.named || named);
      card.style.display = ok ? '' : 'none';
      if (ok) shown += 1;
    });
    document.getElementById('count').textContent = `顯示 ${shown} / ${combos.length} 種`;
  }

  grid.innerHTML = combos.map(cardHTML).join('');

  document.querySelectorAll('.fgroup').forEach((group) => {
    const key = group.dataset.group;
    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        if (key === 'named') {
          filter.named = !filter.named;
          chip.setAttribute('aria-pressed', String(filter.named));
        } else {
          filter[key] = chip.dataset.v;
          group.querySelectorAll('.chip').forEach((c) =>
            c.setAttribute('aria-pressed', String(c === chip)));
        }
        apply();
      });
    });
  });

  /* 詳情彈窗 */
  const modal = document.getElementById('modal');
  const figure = document.getElementById('modal-figure');
  const info = document.getElementById('modal-info');

  function openModal(t) {
    const found = namedFor(t);
    const no = String(comboId(t)).padStart(2, '0');
    figure.innerHTML = renderMinion(t, comboOpts(t));
    const traits = `
      <div class="stat"><span>編號</span><span>No.${no} / 48</span></div>
      <div class="stat"><span>眼睛</span><span>${EYES.find((x) => x.id === t.eyes).name}</span></div>
      <div class="stat"><span>髮型</span><span>${HAIR.find((x) => x.id === t.hair).name}</span></div>
      <div class="stat"><span>身高</span><span>${HEIGHT.find((x) => x.id === t.height).name}</span></div>
      <div class="stat"><span>體型</span><span>${GIRTH.find((x) => x.id === t.girth).name}</span></div>`;
    if (found.length) {
      info.innerHTML = `
        <h3 id="modal-title">${found.map((c) => c.name).join(' & ')}</h3>
        ${traits}
        ${matchCardsHTML(t).replace(/class="match"/g, 'class="match" style="margin-top:14px;margin-bottom:0"')}`;
    } else {
      info.innerHTML = `
        <h3 id="modal-title">未命名小小兵</h3>
        ${traits}
        <div class="match-none" style="margin-top:14px;margin-bottom:0">
          這個組合尚未在電影中獲得名字。
        </div>`;
    }
    modal.hidden = false;
    document.getElementById('modal-close').focus();
  }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const [eyes, hair, height, girth] = card.dataset.key.split('-');
    openModal({ eyes, hair, height, girth });
  });

  document.getElementById('modal-close').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) modal.hidden = true;
  });

  apply();
}

initBuilder();
initDex();
