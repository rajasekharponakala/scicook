/* =====================================================================
   APP STATE
===================================================================== */
const state = {
  tab: 'overview',
  pcCat: 'all',
  pcSoda: false,
  fatFilter: 'all',
  acidSafeOnly: false,
  selectedSpice: 'Cinnamon',
  selectedMolecule: 'All',
  customMasala: ['Cinnamon', 'Cardamom', 'Clove'],
  tasteConc: 'low',
  scovilleScale: 'logarithmic',
  selectedBlend: 'garam',
  onionStage: 3,
  onionSoda: false,
  alliumCut: 'chopped',
  fryTemp: 177,
  selectedPh: 'dish',
  acidRole: 'all',
  revealedMyths: new Set(['m1']),
  selectedAlcohol: 'deglaze',
  papadMode: 'flat',
  svFilter: 'all',
  genSubtab: 'gravy',
  chutney: { cooked: 'Beetroot', raw: 'Carrot', nutty: 'Coconut', herbs: 'None', salt: 'Table salt', acid: 'Yoghurt (Raita)', sweet: 'None (veggie/fruit sweet)' },
  salad: { greens: 'Baby spinach', veg: 'Salted Cucumber + Tomato', fruit: 'Pomegranate', protein: 'Paneer', crunch: 'Fried onions', dressing: 'Bengali (Mustard oil + Vinegar + Kala namak + Chilli)' },
  riceAlgo: 'steamed',
  biryaniChecked: new Set(),
  biryaniRegion: 'hyderabadi',
  timerSeconds: 1800,
  timerInitial: 1800,
  timerLabel: 'Dum Cook (Low Heat)',
  timerHandle: null,
  timerEndsAt: 0,
  phCursor: null,
  logs: []
};

const STORE_KEYS = { log: 'masala_lab_chapatti_log', biryani: 'masala_lab_biryani_checks' };

function storeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function storeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

/** Escape user-controlled strings before they go into innerHTML. */
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// Safe localStorage helpers
function loadLogs() {
  try {
    const raw = storeGet(STORE_KEYS.log);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      // An empty array is a valid, user-chosen state: don't resurrect the samples.
      if (Array.isArray(parsed)) {
        return parsed
          .filter(r => r && typeof r === 'object')
          .map(r => ({ id: String(r.id || 'l_' + Math.random().toString(36).slice(2)), date: String(r.date || ''), dish: String(r.dish || ''), base: Number(r.base) || 0, liquid: Number(r.liquid) || 0, outcome: String(r.outcome || '') }));
      }
    }
  } catch (e) {}
  return INITIAL_LOG.slice();
}
function saveLogs() {
  storeSet(STORE_KEYS.log, JSON.stringify(state.logs));
}

let toastTimeout = null;
function showToast(msg) {
  const box = document.getElementById('toast-box');
  if (!box) return;
  box.textContent = msg;
  box.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    box.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
  }, 2400);
}

/* =====================================================================
   CHARTS (Chart.js instances with live theme colors)
===================================================================== */
let fatChart = null;
let scovilleChart = null;
let svChart = null;

function getChartPalette() {
  // Read the live design tokens so charts match the page styling.
  return {
    text: cssVar('--text-main', '#111111'),
    grid: 'rgba(17,17,17,0.12)',
    accent: cssVar('--accent', '#b91c1c'),
    amber: cssVar('--accent-2', '#d97706'),
    teal: cssVar('--accent-3', '#0f766e'),
    muted: cssVar('--text-muted', '#94a3b8')
  };
}

function chartsAvailable(canvasId) {
  if (typeof Chart !== 'undefined') return true;
  const cv = document.getElementById(canvasId);
  if (cv && !cv.dataset.fallback) {
    cv.dataset.fallback = '1';
    cv.insertAdjacentHTML('afterend', '<div class="absolute inset-0 flex items-center justify-center text-xs text-muted">Chart library failed to load. Check your connection and refresh.</div>');
  }
  return false;
}

function renderFatChart() {
  const ctx = document.getElementById('fat-smoke-chart');
  if (!ctx || !chartsAvailable('fat-smoke-chart')) return;
  const p = getChartPalette();
  const rows = FATS_DATA.filter(f => state.fatFilter === 'all' || (state.fatFilter === 'yes' ? f.fry : !f.fry));
  if (fatChart) fatChart.destroy();
  fatChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map(r => r.name),
      datasets: [{
        label: 'Smoke Point (°C)',
        data: rows.map(r => r.temp),
        backgroundColor: rows.map(r => r.fry ? p.teal : p.accent),
        borderRadius: 0
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => `${c.raw}°C · ${rows[c.dataIndex].fry ? 'Safe for deep-frying' : 'Do NOT deep-fry'}`
          }
        }
      },
      scales: {
        x: { min: 100, max: 280, ticks: { color: p.text }, grid: { color: p.grid }, title: { display: true, text: 'Smoke Point (°C)', color: p.text } },
        y: { ticks: { color: p.text, font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderScovilleChart() {
  const ctx = document.getElementById('scoville-chart');
  if (!ctx || !chartsAvailable('scoville-chart')) return;
  const p = getChartPalette();
  const isLog = state.scovilleScale === 'logarithmic';
  if (scovilleChart) scovilleChart.destroy();
  scovilleChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: SCOVILLE_DATA.map(d => d.name),
      datasets: [{
        label: 'Scoville Heat Units (SHU)',
        data: SCOVILLE_DATA.map(d => isLog ? Math.max(d.shu, 1) : d.shu),
        backgroundColor: SCOVILLE_DATA.map((d, i) => i >= 6 ? p.accent : i >= 3 ? p.amber : p.teal),
        borderRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => {
              const row = SCOVILLE_DATA[c.dataIndex];
              return `${row.shu.toLocaleString()} SHU (${row.buckets.toLocaleString()} × 20L buckets sugar water)`;
            }
          }
        }
      },
      scales: {
        y: { type: isLog ? 'logarithmic' : 'linear', min: isLog ? 1 : 0, title: { display: true, text: 'Scoville heat units', color: p.text },
          ticks: { color: p.text, callback: (v) => { if (!isLog) return Number(v).toLocaleString(); const l = Math.log10(v); return Number.isInteger(Math.round(l * 1e6) / 1e6) ? Number(v).toLocaleString() : null; } }, grid: { color: p.grid } },
        x: { ticks: { color: p.text, font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderSousVideChart() {
  const ctx = document.getElementById('sousvide-chart');
  if (!ctx || !chartsAvailable('sousvide-chart')) return;
  const p = getChartPalette();
  const rows = SOUSVIDE_DATA.filter(d => state.svFilter === 'all' || d.group === state.svFilter);
  if (svChart) svChart.destroy();
  svChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map(r => r.item),
      datasets: [
        { label: 'Temp (°C)', data: rows.map(r => r.temp), backgroundColor: p.accent, yAxisID: 'y', borderRadius: 0 },
        { label: 'Time (mins)', data: rows.map(r => r.mins), backgroundColor: p.amber, yAxisID: 'y1', borderRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: p.text } } },
      scales: {
        x: { ticks: { color: p.text, font: { size: 10 } }, grid: { display: false } },
        y: { position: 'left', min: 40, max: 95, ticks: { color: p.accent }, grid: { color: p.grid }, title: { display: true, text: 'Temp (°C)', color: p.accent } },
        y1: { position: 'right', min: 0, max: 520, ticks: { color: p.amber }, grid: { display: false }, title: { display: true, text: 'Time (mins)', color: p.amber } }
      }
    }
  });
}

/* =====================================================================
   RENDERERS FOR EACH MODULE
===================================================================== */
function searchSections(q) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return SECTION_INDEX.filter(sec => {
    const hay = (sec.title + ' ' + sec.kw).toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}

function renderOverviewBento(filter = '') {
  const grid = document.getElementById('bento-chapter-grid');
  const hitsEl = document.getElementById('atlas-search-hits');
  const q = filter.trim().toLowerCase();
  const toolHits = searchSections(q);
  const hitTabs = new Set(toolHits.map(h => h.tab));
  const matches = CHAPTER_CARDS.filter(c =>
    !q || hitTabs.has(c.id) || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
  );
  if (hitsEl) {
    hitsEl.innerHTML = toolHits.length
      ? `<span class="text-xs font-mono-lab text-muted mr-1">JUMP TO TOOL:</span>` + toolHits.slice(0, 10).map(h =>
          `<button type="button" data-goto="${h.id}" class="lab-btn px-2.5 py-1 text-xs">${escapeHTML(h.title)} <span class="text-muted">· ${h.tab.toUpperCase()}</span></button>`).join('')
      : '';
  }
  if (!matches.length) {
    grid.innerHTML = `<div class="col-span-full lab-subpanel p-6 text-center text-sm text-muted">No chapters match "${escapeHTML(filter)}". Try "spices", "biryani", "acid", or "brine".</div>`;
    return;
  }
  grid.innerHTML = matches.map(c => `
    <button type="button" data-jump="${c.id}" class="element-tile lab-card lab-card-interactive p-4 text-left flex flex-col justify-between gap-3" style="--hue:${c.hue};">
      <div>
        <div class="flex items-start justify-between gap-2">
          <span class="font-mono-lab text-xs font-bold" style="color:var(--hue);">${c.num}</span>
          <span class="amber-pill px-2 py-0.5 text-[11px] font-mono-lab">${c.metric}</span>
        </div>
        <div class="element-symbol font-display" aria-hidden="true">${c.sym}</div>
        <div class="font-display font-bold text-lg leading-snug mb-1">${c.title}</div>
        <p class="text-xs text-muted leading-relaxed">${c.summary}</p>
      </div>
      <div class="text-xs font-semibold flex items-center justify-between pt-2 border-t" style="border-color:var(--border-subtle);color:var(--hue);">
        <span>${c.tag}</span>
        <span>Open &rarr;</span>
      </div>
    </button>
  `).join('');
}

function updateThermal(val) {
  const temp = Number(val);
  document.getElementById('temp-readout').textContent = `${temp}°C`;
  // Use the regime you have *reached*: the highest milestone at or below the temperature.
  let best = THERMAL_MILESTONES[0];
  for (const m of THERMAL_MILESTONES) if (m.t <= temp) best = m;
  document.getElementById('temp-zone-badge').textContent = best.badge;
  document.getElementById('temp-title').textContent = `${best.title} (${best.t}°C)`;
  document.getElementById('temp-desc').textContent = best.desc;
  document.getElementById('temp-regime').textContent = best.regime;
  document.getElementById('temp-tip').textContent = best.tip;
  const next = THERMAL_MILESTONES.find(m => m.t > temp);
  const nextEl = document.getElementById('temp-next');
  if (nextEl) nextEl.textContent = next ? `Next threshold: ${next.title} at ${next.t}°C (+${next.t - temp}°)` : 'Beyond this, only charcoal and tandoors go.';

  document.querySelectorAll('[data-temp-pill]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.tempPill) === best.t);
  });
  renderThermoBand(temp);
  setKineticsTemp(temp);
}

function renderThermalMilestones() {
  const wrap = document.getElementById('thermal-milestones');
  wrap.innerHTML = THERMAL_MILESTONES.map(m =>
    `<button type="button" data-temp-pill="${m.t}" class="lab-btn px-2.5 py-1 text-xs font-mono-lab">${m.label}</button>`
  ).join('');
}

function renderPressureList() {
  const wrap = document.getElementById('pc-list');
  const items = PRESSURE_ITEMS.filter(i => state.pcCat === 'all' || i.cat === state.pcCat);
  wrap.innerHTML = items.map(i => {
    const mins = (state.pcSoda && i.hard) ? Math.round(i.mins * 0.6) : i.mins;
    const badge = (state.pcSoda && i.hard) ? `<span class="teal-pill px-1.5 py-0.5 text-[10px] font-mono-lab">-40% SODA</span>` : '';
    return `
      <div class="lab-subpanel p-3 flex items-center justify-between gap-2">
        <div>
          <div class="font-semibold text-xs sm:text-sm">${i.name}</div>
          <div class="text-[11px] text-muted">${i.soak} ${badge}</div>
        </div>
        <div class="font-mono-lab font-bold text-base shrink-0" style="color:var(--accent);">${mins}m</div>
      </div>
    `;
  }).join('');
}

function renderCookwareList() {
  const wrap = document.getElementById('cookware-list');
  const rows = COOKWARE_DATA.filter(c => !state.acidSafeOnly || c.acidSafe);
  wrap.innerHTML = rows.map(c => `
    <div class="lab-subpanel p-3">
      <div class="flex items-center justify-between gap-2 mb-0.5">
        <span class="font-semibold text-sm">${c.name}</span>
        <span class="${c.acidSafe ? 'teal-pill' : 'accent-pill'} px-2 py-0.5 text-[10px] font-mono-lab">${c.acidSafe ? 'ACID-SAFE' : 'REACTS W/ ACID'}</span>
      </div>
      <p class="text-xs text-muted">${c.desc}</p>
    </div>
  `).join('');
}

// Chapter 2: 23-Spice Radial Network SVG
function renderSpiceNetwork() {
  const svg = document.getElementById('spice-network-svg');
  const cx = 300, cy = 300, r = 205;
  const n = SPICES_23.length;
  const pos = {};
  SPICES_23.forEach((sp, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    pos[sp.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle };
  });

  const activeSpiceObj = SPICES_23.find(s => s.id === state.selectedSpice) || SPICES_23[0];
  const molFilter = state.selectedMolecule;
  const matchingByMol = new Set(
    molFilter === 'All' ? [] : SPICES_23.filter(s => s.molecules.includes(molFilter)).map(s => s.id)
  );

  let edges = '';
  // Draw subtle pairing edges
  SPICES_23.forEach(sp => {
    sp.pairs.forEach(targetId => {
      if (sp.id < targetId && pos[targetId]) {
        const isActiveEdge = (molFilter === 'All')
          ? (sp.id === activeSpiceObj.id || targetId === activeSpiceObj.id)
          : (matchingByMol.has(sp.id) && matchingByMol.has(targetId));
        if (isActiveEdge) {
          const p1 = pos[sp.id], p2 = pos[targetId];
          edges += `<path class="edge-live" d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx} ${cy} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.7" />`;
        } else {
          const p1 = pos[sp.id], p2 = pos[targetId];
          edges += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="var(--border-subtle)" stroke-width="0.7" opacity="0.35" />`;
        }
      }
    });
  });

  let nodes = '';
  SPICES_23.forEach(sp => {
    const p = pos[sp.id];
    const isSelected = sp.id === activeSpiceObj.id;
    const isPartner = activeSpiceObj.pairs.includes(sp.id);
    const isMolMatch = matchingByMol.has(sp.id);
    const highlight = molFilter === 'All' ? (isSelected || isPartner) : isMolMatch;
    const catColor = SPICE_CATEGORY_COLORS[sp.cat] || 'var(--text-muted)';
    const fill = isSelected ? 'var(--accent)' : highlight ? catColor : 'var(--surface-strong)';
    const stroke = isSelected ? 'var(--text-main)' : catColor;
    const rad = isSelected ? 12 : highlight ? 9 : 6.5;

    const lx = cx + (r + 36) * Math.cos(p.angle);
    const ly = cy + (r + 36) * Math.sin(p.angle);
    const anchor = Math.cos(p.angle) > 0.25 ? 'start' : Math.cos(p.angle) < -0.25 ? 'end' : 'middle';

    nodes += `
      <g class="spice-node${highlight ? ' is-lit' : ''}" data-spice-node="${sp.id}" role="button" tabindex="0" aria-label="${sp.id}, ${sp.cat}" aria-pressed="${isSelected}">
        <title>${sp.id} · ${sp.cat} · ${sp.molecules.join(', ')}</title>
        ${isSelected ? `<circle class="pulse-ring" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="18" fill="none" stroke="var(--accent)" stroke-width="2" />` : ''}
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${isSelected ? 3 : 2}" />
        <text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}" font-size="${isSelected ? 12.5 : 10.5}" font-weight="${highlight ? 700 : 500}" fill="${highlight ? 'var(--text-main)' : 'var(--text-muted)'}">${sp.id}</text>
      </g>
    `;
  });

  const centerLabel = molFilter === 'All' ? activeSpiceObj.id : molFilter;
  const centerSub = molFilter === 'All' ? `${activeSpiceObj.pairs.length} pairings` : `${matchingByMol.size} spices share it`;

  svg.innerHTML = `
    ${edges}
    <circle cx="${cx}" cy="${cy}" r="54" fill="var(--surface-strong)" stroke="var(--border-subtle)" stroke-width="1.5" />
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text-main)">${centerLabel}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="10.5" fill="var(--text-muted)">${centerSub}</text>
    ${nodes}
  `;

  // Update Inspector Panel
  const insp = document.getElementById('spice-inspector');
  const inMix = state.customMasala.includes(activeSpiceObj.id);
  insp.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-2">
      <div>
        <div class="text-xs font-mono-lab text-muted">${activeSpiceObj.cat.toUpperCase()}</div>
        <div class="font-display text-2xl font-bold">${activeSpiceObj.id}</div>
      </div>
      <button type="button" id="toggle-masala-spice" data-spice-add="${activeSpiceObj.id}" class="lab-btn ${inMix ? 'active' : ''} px-3 py-1.5 text-xs">
        ${inMix ? 'In Masala ✓' : '+ Add to Masala'}
      </button>
    </div>
    <p class="text-xs text-muted mb-3"><strong>Flavour Profile:</strong> ${activeSpiceObj.notes}</p>
    <div class="mb-3">
      <div class="text-[11px] font-mono-lab text-muted mb-1">FLAVOUR MOLECULES</div>
      <div class="flex flex-wrap gap-1.5">
        ${activeSpiceObj.molecules.map(m => `<button type="button" data-view-mol="${m}" class="lab-btn ${m === state.viewMolecule ? 'active' : ''} px-2 py-0.5 text-xs font-mono-lab">${m}</button>`).join('')}
      </div>
    </div>
    <div class="mol-viewer lab-subpanel p-2 mb-3">
      <canvas id="mol-canvas" width="300" height="170" class="w-full h-[170px]" aria-label="Skeletal structure of the selected flavour molecule" role="img"></canvas>
      <div id="mol-caption" class="text-[11px] text-muted px-1 pb-1"></div>
    </div>
    <div>
      <div class="text-[11px] font-mono-lab text-muted mb-1">MOLECULAR PAIRINGS (CLICK TO INSPECT)</div>
      <div class="flex flex-wrap gap-1.5">
        ${activeSpiceObj.pairs.map(pr => `<button type="button" data-spice-node="${pr}" class="lab-btn px-2 py-0.5 text-xs">${pr}</button>`).join('')}
      </div>
    </div>
  `;

  if (!activeSpiceObj.molecules.includes(state.viewMolecule)) state.viewMolecule = activeSpiceObj.molecules[0];
  renderMoleculeViewer();
  renderSpiceLegend();
  renderCustomMasala();
}

function renderMoleculeViewer() {
  const cv = document.getElementById('mol-canvas');
  if (!cv) return;
  const name = state.viewMolecule;
  drawMolecule(cv, name, { width: cv.clientWidth || 300, height: 170 });
  const mol = MOLECULE_LIBRARY[name];
  document.getElementById('mol-caption').innerHTML = mol
    ? `<strong style="color:var(--text-main)">${name}</strong> · <span class="font-mono-lab">${formulaHtml(mol.formula)}</span> · ${mol.cls}`
    : `${name}: structure not in library`;
  document.querySelectorAll('[data-view-mol]').forEach(b => b.classList.toggle('active', b.dataset.viewMol === name));
}

function renderSpiceLegend() {
  const el = document.getElementById('spice-legend');
  if (!el || el.dataset.done) return;
  el.dataset.done = '1';
  el.innerHTML = Object.entries(SPICE_CATEGORY_COLORS).map(([k, c]) =>
    `<span class="inline-flex items-center gap-1.5 text-[11px] text-muted"><span class="w-2.5 h-2.5 rounded-full" style="background:${c}"></span>${k}</span>`).join('');
}

function renderCustomMasala() {
  const chips = document.getElementById('custom-masala-chips');
  const analysis = document.getElementById('custom-masala-analysis');
  if (!state.customMasala.length) {
    chips.innerHTML = `<span class="text-xs text-muted">Click spices on the graph and press "+ Add to Masala".</span>`;
    analysis.textContent = '';
    return;
  }
  chips.innerHTML = state.customMasala.map(id =>
    `<button type="button" data-remove-spice="${id}" class="accent-pill px-2.5 py-1 text-xs font-medium cursor-pointer">${id} &times;</button>`
  ).join('');

  // Find shared molecules across chosen spices
  const molCounts = {};
  state.customMasala.forEach(id => {
    const sp = SPICES_23.find(s => s.id === id);
    if (sp) sp.molecules.forEach(m => { molCounts[m] = (molCounts[m] || 0) + 1; });
  });
  const shared = Object.entries(molCounts).filter(([, c]) => c >= 2).map(([m]) => m);
  const countWarn = state.customMasala.length > 6
    ? 'Warning: >6 spices may blur into generic "instant-noodle masala" territory (p. 97)!'
    : state.customMasala.length >= 2
      ? 'Balanced batch size—dry-roast whole spices gently and grind fresh in a coffee grinder.'
      : 'Add at least 1 more partner spice that shares a volatile molecule.';

  analysis.innerHTML = `
    <div class="mb-1"><strong>Shared Molecular Bridges:</strong> ${shared.length ? shared.join(', ') : 'None yet — try adding a highlighted partner!'}</div>
    <div>${countWarn}</div>
  `;
}

function renderTasteMap() {
  const svg = document.getElementById('taste-map-svg');
  const isLow = state.tasteConc === 'low';
  const arrows = isLow ? `
    <path d="M 88 125 Q 115 70 155 56" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-g)" />
    <text x="86" y="78" font-size="11" font-weight="600" fill="#059669">enhances</text>

    <path d="M 88 175 Q 115 230 155 244" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-r)" />
    <text x="72" y="232" font-size="11" font-weight="600" fill="#dc2626">suppresses</text>

    <path d="M 190 78 L 190 218" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-g)" />
    <text x="198" y="152" font-size="11" font-weight="600" fill="#059669">enhances</text>

    <path d="M 292 175 Q 265 230 225 244" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-g)" />
    <text x="266" y="232" font-size="11" font-weight="600" fill="#059669">enhances</text>
  ` : `
    <path d="M 88 125 Q 115 70 155 56" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-g)" />
    <text x="86" y="78" font-size="11" font-weight="600" fill="#059669">enhances</text>

    <path d="M 88 175 Q 115 230 155 244" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-r)" />
    <text x="72" y="232" font-size="11" font-weight="600" fill="#dc2626">suppresses</text>

    <path d="M 190 78 L 190 218" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-r)" />
    <text x="198" y="152" font-size="11" font-weight="600" fill="#dc2626">suppresses</text>

    <path d="M 225 56 Q 265 70 292 125" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-r)" />
    <text x="262" y="78" font-size="11" font-weight="600" fill="#dc2626">suppresses</text>

    <path d="M 292 175 Q 268 232 225 248" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arr-r)" />
    <text x="266" y="238" font-size="11" font-weight="600" fill="#dc2626">suppresses</text>

    <path d="M 218 228 Q 250 198 278 168" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arr-g)" />
    <text x="218" y="196" font-size="10.5" font-weight="600" fill="#059669">enhances</text>
  `;

  svg.innerHTML = `
    <defs>
      <marker id="arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
      </marker>
      <marker id="arr-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
      </marker>
    </defs>
    ${arrows}
    <circle cx="190" cy="48" r="28" fill="var(--accent-2-soft)" stroke="var(--accent-2)" stroke-width="2" />
    <text x="190" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">Sweet</text>

    <circle cx="64" cy="150" r="28" fill="var(--accent-3-soft)" stroke="var(--accent-3)" stroke-width="2" />
    <text x="64" y="154" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">Salt</text>

    <circle cx="316" cy="150" r="28" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" />
    <text x="316" y="154" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">Sour</text>

    <circle cx="190" cy="252" r="28" fill="var(--surface-strong)" stroke="var(--text-muted)" stroke-width="2" />
    <text x="190" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">Bitter</text>
  `;

  document.getElementById('taste-map-caption').innerHTML = isLow
    ? '<strong>Sub-Threshold Magic (p. 71):</strong> A tiny pinch of salt in kheer/payasam amplifies sweetness without tasting salty (why jaggery works so well—it naturally contains trace salt!).'
    : '<strong>Medium Concentration Balance (p. 71):</strong> Sugar suppresses both sourness and bitterness; salt suppresses bitterness and mutes overly sour yoghurt; sourness suppresses bitterness.';
}

function renderBlends() {
  const tabs = document.getElementById('blend-tabs');
  tabs.innerHTML = SPICE_BLENDS.map(b =>
    `<button type="button" data-blend="${b.id}" class="lab-btn ${b.id === state.selectedBlend ? 'active' : ''} px-3 py-1 text-xs">${b.name}</button>`
  ).join('');
  const b = SPICE_BLENDS.find(x => x.id === state.selectedBlend) || SPICE_BLENDS[0];
  const sizes = { 5: 'text-2xl sm:text-3xl font-bold', 4: 'text-xl sm:text-2xl font-semibold', 3: 'text-base sm:text-lg font-medium', 2: 'text-xs sm:text-sm text-muted' };
  document.getElementById('blend-cloud').innerHTML = b.items.map(it =>
    `<span class="font-display ${sizes[it.w] || 'text-sm'}" style="color:${it.w >= 5 ? 'var(--accent)' : it.w === 4 ? 'var(--accent-2)' : 'var(--text-main)'};">${it.n}</span>`
  ).join('');
  document.getElementById('blend-notes').innerHTML = `
    <div class="amber-pill inline-block px-2.5 py-0.5 text-xs font-mono-lab mb-1">${b.region}</div>
    <div class="font-display text-xl font-bold">${b.name}</div>
    <p class="text-xs text-muted leading-relaxed">${b.note}</p>
    <div class="text-xs text-muted pt-2 border-t" style="border-color:var(--border-subtle);">
      <strong>Extraction Rule (p. 92):</strong> Whole spices go in hot oil at the start; freshly ground powders go in on low heat toward the end; fresh/dry herbs go right at the finish.
    </div>
  `;
}

// Chapter 3 Renderers
function renderOnionSimulator() {
  const st = ONION_STAGES[state.onionStage];
  const swatch = document.getElementById('onion-swatch');
  const circle = document.getElementById('onion-circle');
  const darkText = state.onionStage < 5;
  swatch.style.background = st.bg;
  swatch.style.color = darkText ? '#111827' : '#fef3c7';
  circle.style.background = st.circle;
  document.getElementById('onion-stage-code').textContent = st.code;
  document.getElementById('onion-stage-name').textContent = st.name;
  document.getElementById('onion-stage-chem').textContent = st.chem;
  document.getElementById('onion-stage-dishes').textContent = st.dishes;
  renderOnionSection(state.onionStage);
  document.getElementById('onion-stage-time').textContent = state.onionSoda && state.onionStage >= 3
    ? `Accelerated with tiny pinch of baking soda: cuts browning time roughly in half by breaking pectin & raising pH! (Don’t overuse or it tastes soapy, p. 107).`
    : st.time;
}

function renderAlliumCut() {
  const map = {
    whole: { level: 'Mildest Flavour', onion: 'Pole-to-pole slicing runs parallel to long onion cells—minimal cell rupture, minimal tears, gentle sweetness.', garlic: 'Whole cloves give mellow, rounded garlicky warmth; roast a whole foil-wrapped bulb at 175°C for 30 mins for sweet caramelized garlic butter (p. 111).' },
    chopped: { level: 'Medium Flavour', onion: 'Cutting across the bulb breaks more cells → more syn-Propanethial-S-oxide (and more meaty MMP when cooked). Use a sharp knife + USB fan or chill briefly!', garlic: 'Roughly chopped garlic releases moderate allicin; sauté on medium-low heat after onions so onion moisture protects garlic from burning.' },
    minced: { level: 'High Flavour', onion: 'Fine mince maximizes cell damage and pungent MMP release—great for quick intense gravies.', garlic: 'Minced garlic packs strong pungency and burns rapidly (only 59% water & 30% sugar). Add later for punchier garlic notes.' },
    paste: { level: 'Insane Flavour', onion: 'Pureed onion releases maximum moisture & flavour—add early and cook long to drive off water before browning (p. 160).', garlic: 'Granite mortar & pestle beats high-speed blenders (which heat and partially cook fresh ginger/garlic!). Avoid store-bought paste with sour sodium citrate (p. 38, 96).' }
  };
  const d = map[state.alliumCut];
  document.getElementById('allium-cut-result').innerHTML = `
    <div class="accent-pill inline-block px-2.5 py-0.5 text-xs font-mono-lab font-bold">${d.level.toUpperCase()}</div>
    <p class="text-xs sm:text-sm"><strong>Onion:</strong> ${d.onion}</p>
    <p class="text-xs sm:text-sm"><strong>Garlic:</strong> ${d.garlic}</p>
    <p class="text-xs text-muted pt-2 border-t" style="border-color:var(--border-subtle);">Garlic breath fix (p. 111): Eat raw apple, pear, parsley, or peppermint—polyphenol oxidase reduces volatile mercaptans!</p>
  `;
}

function renderFryDiagnostic() {
  const t = Number(state.fryTemp);
  document.getElementById('fry-temp-val').textContent = `${t}°C`;
  let status, badge, detail;
  if (t < 165) {
    status = 'Too Cool · Greasy & Soggy';
    badge = 'amber-pill';
    detail = 'Below 170°C, the outer moisture doesn’t flash-evaporate fast enough to seal a waterproof crust. Hot oil seeps inside your puri or vada, making it heavy and oily (p. 116).';
  } else if (t <= 192) {
    status = 'Sweet Spot (170–190°C) · Crisp Exterior, Soft Interior';
    badge = 'teal-pill';
    detail = 'Surface water instantly flashes into steam, creating a non-porous crust that undergoes rapid Maillard browning while interior starches gelatinize cleanly. Use the smallest kadai to minimize oil oxidation and keep finished fried food crisp in a 93°C oven! (pp. 116–117).';
  } else {
    status = 'Too Hot · Burnt Shell, Raw Centre & Oxidized Oil';
    badge = 'accent-pill';
    detail = 'Above 195°C, the exterior scorches before heat reaches the centre (leaving raw dough inside), bitter acrylamide spikes, and oil oxidizes rapidly into rancid aldehydes & ketones (pp. 66, 116).';
  }
  document.getElementById('fry-diagnostic').innerHTML = `
    <span class="${badge} inline-block px-2.5 py-1 text-xs font-mono-lab font-bold">${status}</span>
    <p class="text-xs sm:text-sm text-muted leading-relaxed">${detail}</p>
  `;
}

function renderMaillardCards() {
  document.getElementById('maillard-cards').innerHTML = MAILLARD_MOLECULES.map(m => {
    const rep = MAILLARD_REPRESENTATIVE[m.name];
    const mol = MOLECULE_LIBRARY[rep];
    return `
    <div class="lab-subpanel p-4 border-t-4 flex gap-3 items-start" style="border-top-color:${m.color};">
      <div class="flex-1 min-w-0">
        <div class="font-display font-bold text-lg">${m.name}</div>
        <p class="text-xs text-muted mt-1 leading-relaxed">${m.note}</p>
        <div class="text-[10.5px] font-mono-lab mt-2" style="color:${m.color}">${m.name === 'Melanoidins' ? 'Watch out for' : 'e.g.'} ${rep} · ${formulaHtml(mol.formula)}</div>
      </div>
      <canvas data-maillard-canvas="${m.name}" width="170" height="110" class="w-[120px] h-[78px] shrink-0" role="img" aria-label="Structure of ${rep}"></canvas>
    </div>`;
  }).join('');
  renderMaillardStructures();
}

// Chapter 4 Renderers
function renderPhScale() {
  document.getElementById('ph-buttons').innerHTML = PH_BENCHMARKS.map(b =>
    `<button type="button" data-ph-id="${b.id}" class="lab-btn ${b.id === state.selectedPh ? 'active' : ''} px-3 py-1.5 text-xs font-mono-lab">${b.label}</button>`
  ).join('');
  const item = PH_BENCHMARKS.find(b => b.id === state.selectedPh) || PH_BENCHMARKS[3];
  state.phCursor = item.ph;
  renderPhSvg();
  document.getElementById('ph-detail').innerHTML = `
    <div class="font-display text-lg font-bold mb-1">${item.title}</div>
    <p class="text-xs sm:text-sm text-muted leading-relaxed">${item.body}</p>
  `;
}

function renderAcidCards() {
  const rows = ACIDS_LIST.filter(a => state.acidRole === 'all' || a.role === state.acidRole);
  document.getElementById('acid-cards').innerHTML = rows.map(a => `
    <div class="lab-subpanel p-3.5">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span class="font-bold text-sm">${a.name}</span>
        <span class="${a.role === 'anchor' ? 'accent-pill' : 'teal-pill'} px-2 py-0.5 text-[10px] font-mono-lab uppercase">${a.role}</span>
      </div>
      <div class="text-[11px] font-mono-lab text-muted mb-1">${a.acid} · "${a.band}"</div>
      <p class="text-xs text-muted leading-relaxed">${a.note}</p>
    </div>
  `).join('');
}

// Chapter 5 Renderers
function renderUmami() {
  const g = document.getElementById('umami-glutamate').value;
  const n = document.getElementById('umami-nucleotide').value;
  const hasSynergy = n !== 'none';
  const examples = {
    'tomato-mutton': 'Classic Indian Mutton Curry / Rogan Josh: glutamate-rich tomato pulp amplifies inosinate-rich mutton.',
    'onion-mutton': 'Bhuna Gosht (p. 134): Krish’s textbook Indian glutamate + inosinate umami bomb.',
    'cabbage-mutton': 'North-East Indian meat & cabbage stocks: double-layered natural umami (p. 134).',
    'kombu-bonito': 'Japanese Dashi Stock: Kikunae Ikeda’s 1908 discovery pairing seaweed glutamates with tuna IMP (p. 134).',
    'tomato-mushroom': 'Vegetarian Umami Bomb: tomato glutamates + mushroom GMP deliver meaty depth without meat (p. 135).',
    'msg-anchovy': 'Coastal Curry Turbo: tiny anchovies pack more umami than expensive big fish (p. 134).'
  };
  const pairNote = examples[`${g}-${n}`] || (hasSynergy
    ? 'Super-linear T1R1/T1R3 synergy! The nucleotide binds next to glutamate and holds the receptor “closed”, so savoury flavours linger much longer.'
    : 'Single-channel glutamate savouriness. Add an IMP/GMP nucleotide (meat, anchovies, or mushrooms) to multiply intensity!');
  const m = umamiModel();
  const width = Math.min(100, 12 + Math.log10(Math.max(1, m.mult)) * 40);

  document.getElementById('umami-output').innerHTML = `
    <div>
      <div class="text-xs font-mono-lab text-muted mb-1">RECEPTOR AMPLIFICATION</div>
      <div class="font-display text-2xl font-bold" style="color:${hasSynergy ? 'var(--accent)' : 'var(--accent-2)'};">
        ${hasSynergy ? `${m.mult.toFixed(1)}× Umami Bomb!` : 'Baseline Umami (1×)'}
      </div>
    </div>
    <div class="w-full h-3 rounded-full overflow-hidden my-2" style="background:var(--border-subtle);" role="meter" aria-valuemin="1" aria-valuenow="${m.mult.toFixed(1)}" aria-label="Umami multiplier">
      <div class="h-full transition-all duration-300" style="width:${width}%;background:${hasSynergy ? 'var(--accent)' : 'var(--accent-2)'};"></div>
    </div>
    <p class="text-xs text-muted">${pairNote}</p>
  `;
  renderUmamiModel();
}

function renderMyths() {
  document.getElementById('myth-grid').innerHTML = MYTHS_LIST.map(m => {
    const open = state.revealedMyths.has(m.id);
    return `
      <button type="button" data-myth-id="${m.id}" class="lab-subpanel p-4 text-left flex flex-col justify-between gap-3 cursor-pointer hover:opacity-95 transition">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="${open ? 'teal-pill' : 'accent-pill'} px-2 py-0.5 text-[10px] font-mono-lab font-bold">${open ? 'SCIENCE VERIFIED' : 'WHATSAPP MYTH'}</span>
            <span class="text-xs text-muted">${open ? 'Hide' : 'Bust myth →'}</span>
          </div>
          <div class="font-semibold text-sm leading-snug">${m.myth}</div>
        </div>
        ${open ? `<p class="text-xs text-muted leading-relaxed pt-2 border-t" style="border-color:var(--border-subtle);">${m.truth}</p>` : ''}
      </button>
    `;
  }).join('');
}

function renderAlcohol() {
  document.getElementById('alcohol-tabs').innerHTML = ALCOHOL_TECHS.map(a =>
    `<button type="button" data-alc="${a.id}" class="lab-btn ${a.id === state.selectedAlcohol ? 'active' : ''} px-3 py-1.5 text-xs">${a.title}</button>`
  ).join('');
  const item = ALCOHOL_TECHS.find(a => a.id === state.selectedAlcohol) || ALCOHOL_TECHS[0];
  document.getElementById('alcohol-detail').innerHTML = `
    <div class="font-bold text-base mb-1">${item.title}</div>
    <p class="text-xs sm:text-sm text-muted leading-relaxed">${item.text}</p>
  `;
}

// Chapter 6: Microwave visualizer (animated in viz.js)
function renderMicrowaveSvg() {
  drawMicrowaveFrame(performance.now());
  document.getElementById('papad-explain').textContent = state.papadMode === 'flat'
    ? 'At 2450 MHz the microwaves have a 12 cm wavelength. The waves bounce between the oven walls and form a standing wave, which has zero-field nodes every 6 cm. Heating follows E², so a flat papad keeps chewy, uncooked stripes on those nodes (p. 145).'
    : 'Roll the raw papad upright inside a glass tumbler. As the turntable spins, every millimetre of papad passes through the high-energy antinodes, so it heats evenly. That is why restaurant papads come out tubular (p. 146).';
}

// Chapter 7 Generators
function renderGravyStack() {
  const mainKey = document.getElementById('gravy-main').value;
  const regKey = document.getElementById('gravy-region').value;
  const useAlc = document.getElementById('gravy-alcohol').checked;
  const useBase = document.getElementById('gravy-base').checked;
  const useSmoke = document.getElementById('gravy-smoke').checked;
  const r = GRAVY_REGIONS[regKey];

  const blocks = [
    { label: '8 · FINISHING FLAVOURS (Pick 2–3 max!)', body: `${r.finish}${useSmoke ? ' + Dhungar (hot charcoal + 1 tsp ghee sealed 2–3 mins) or 2 drops liquid smoke' : ''}. Optional umami pinch (MSG/mushroom powder).`, accent: 'var(--accent-3)' },
    { label: '7 · SEASONING BALANCE', body: '1–1.5% Salt by weight + pinch of Sugar/Jaggery (3-way balance between salt, sweet, and sour elevates all spices!).', accent: 'var(--accent-2)' },
    { label: '6 · BASE ACID', body: r.acid, accent: 'var(--accent)' },
    { label: '5 · STOCK / LIQUID', body: r.stock, accent: 'var(--accent-3)' },
    { label: '4 · PREPPED MAIN INGREDIENT', body: GRAVY_PREP[mainKey], accent: 'var(--accent)' },
    ...(useBase ? [{ label: '3 · FROZEN BASE GRAVY (OPTIONAL SHORTCUT)', body: `${r.baseGravy} — microwave frozen silicone cups to temp and cook briefly (already cooked!).`, accent: 'var(--accent-2)' }] : []),
    ...(useAlc ? [{ label: '2 · ALCOHOL DEGLAZE (OPTIONAL)', body: 'Splash cheap brandy, vodka, or rum to lift Maillard fond and extract fat/alcohol-soluble spice volatiles before adding water.', accent: 'var(--accent-2)' }] : []),
    { label: '1 · FLAVOUR BASE (BOTTOM OF POT)', body: `Heat ${r.fat} → bloom ${r.whole} → cook ${r.aromatics} → lower heat & add ${r.spiceMix}.`, accent: 'var(--accent)' }
  ];

  document.getElementById('gravy-stack-output').innerHTML = blocks.map(b => `
    <div class="lab-subpanel p-3.5 border-l-4" style="border-left-color:${b.accent};">
      <div class="font-mono-lab text-[11px] font-bold text-muted">${b.label}</div>
      <div class="text-sm mt-0.5">${b.body}</div>
    </div>
  `).join('');
}

function renderBreadCalc() {
  const idx = Number(document.getElementById('bread-type').value) || 0;
  const flour = Math.max(50, Number(document.getElementById('bread-flour').value) || 200);
  const b = BREADS_DATA[idx];
  const liquidG = Math.round(flour * (b.pct / 100));
  const saltG = Math.max(1, ((flour + liquidG) * 0.01).toFixed(1));
  document.getElementById('bread-output').innerHTML = `
    <div class="grid grid-cols-3 gap-2 text-center pb-3 border-b" style="border-color:var(--border-subtle);">
      <div><div class="font-mono-lab text-xl font-bold" style="color:var(--accent);">${liquidG}g</div><div class="text-[11px] text-muted">${b.liquid} (${b.pct}%)</div></div>
      <div><div class="font-mono-lab text-xl font-bold" style="color:var(--accent-2);">${saltG}g</div><div class="text-[11px] text-muted">Salt (~1%)</div></div>
      <div><div class="font-mono-lab text-xl font-bold" style="color:var(--accent-3);">${b.autolyse}m</div><div class="text-[11px] text-muted">Autolyse Rest</div></div>
    </div>
    <div class="text-xs"><strong>Flour Base:</strong> ${b.flour} · <strong>Enrichment:</strong> ${b.enrich} · <strong>Leavening:</strong> ${b.leaven}</div>
    <p class="text-xs text-muted">${b.tip}</p>
    <p class="text-xs text-muted pt-2 border-t" style="border-color:var(--border-subtle);"><strong>Gluten-Free Millet Rotis (p. 172):</strong> Knead jowar/bajra flour with boiling water (gelatinizes sticky amylopectin) OR blend 30% wheat OR add a tiny pinch of <strong>xanthan gum</strong>.</p>
  `;
}

function renderBrineCalc() {
  const idx = Number(document.getElementById('brine-cut').value) || 0;
  const water = Math.max(250, Number(document.getElementById('brine-water').value) || 1000);
  const c = BRINE_CUTS[idx];
  const saltG = Math.round(water * 0.08);
  document.getElementById('brine-output').innerHTML = `
    <div class="grid grid-cols-2 gap-3 text-center pb-3 border-b" style="border-color:var(--border-subtle);">
      <div><div class="font-mono-lab text-2xl font-bold" style="color:var(--accent);">${saltG}g</div><div class="text-xs text-muted">Salt (8% of ${water}ml)</div></div>
      <div><div class="font-mono-lab text-2xl font-bold" style="color:var(--accent-3);">${c.mins} mins</div><div class="text-xs text-muted">Refrigerated Brine Time</div></div>
    </div>
    <ol class="list-decimal pl-4 text-xs text-muted space-y-1">
      <li>Dissolve ${saltG}g salt (+ optional spices/sugar) in warm water, then cool fully to room temperature.</li>
      <li>Submerge ${c.name.toLowerCase()} completely so zero surface touches air; refrigerate for ${c.mins} mins.</li>
      <li>Rinse surface salt in plain water before marinating (go easy on marinade salt!).</li>
    </ol>
  `;
}

function renderChutneyGen() {
  const ctrl = document.getElementById('chutney-controls');
  ctrl.innerHTML = CHUTNEY_COLS.map(col => `
    <div>
      <label class="block text-[11px] font-mono-lab text-muted mb-1">${col.label}</label>
      <select data-chutney-key="${col.key}" class="lab-input w-full text-xs">
        ${col.opts.map(o => `<option value="${o}" ${state.chutney[col.key] === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>
  `).join('');
  const c = state.chutney;
  const greenWarn = (c.herbs !== 'None' && c.acid !== 'Yoghurt (Raita)')
    ? `<div class="accent-pill inline-block px-2.5 py-1 text-xs font-medium mt-1">Green-Leaf Alert (p. 189): Add ${c.acid} right before serving—strong acids strip magnesium from chlorophyll and turn greens dull olive!</div>`
    : '';
  document.getElementById('chutney-result').innerHTML = `
    <div class="font-display text-lg font-bold">Your Custom ${c.acid.includes('Raita') ? 'Raita' : 'Chutney'}: ${c.cooked}${c.raw !== 'None' ? ' &amp; ' + c.raw : ''} + Roasted ${c.nutty}</div>
    <p class="text-xs sm:text-sm text-muted">Sauté/cook <strong>${c.cooked}</strong>, oil-roast <strong>${c.nutty}</strong>, then blend with ${c.raw !== 'None' ? `raw <strong>${c.raw}</strong>, ` : ''}${c.herbs !== 'None' ? `<strong>${c.herbs}</strong>, ` : ''}<strong>${c.salt}</strong>, <strong>${c.acid}</strong>, chilli/pepper for heat, and <strong>${c.sweet}</strong>. Finish with regional mustard-curry-leaf-hing tempering!</p>
    ${greenWarn}
  `;
}

function renderSaladGen() {
  const ctrl = document.getElementById('salad-controls');
  ctrl.innerHTML = SALAD_COLS.map(col => `
    <div>
      <label class="block text-[11px] font-mono-lab text-muted mb-1">${col.label}</label>
      <select data-salad-key="${col.key}" class="lab-input w-full text-xs">
        ${col.opts.map(o => `<option value="${o}" ${state.salad[col.key] === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>
  `).join('');
  const s = state.salad;
  document.getElementById('salad-result').innerHTML = `
    <div class="font-display text-lg font-bold">Balanced Salad Blueprint</div>
    <p class="text-xs sm:text-sm text-muted">Toss chilled <strong>${s.greens}</strong> + <strong>${s.veg}</strong> + <strong>${s.fruit}</strong> + <strong>${s.protein}</strong> + <strong>${s.crunch}</strong>. Just before serving, dress with emulsified <strong>${s.dressing}</strong> (3 parts fat : 1 part acid; whisk with honey, mustard paste, or soy lecithin so the dressing clings to leaves instead of pooling at the bottom, p. 191).</p>
  `;
}

function renderRiceAlgos() {
  document.getElementById('rice-algo-tabs').innerHTML = RICE_ALGOS.map(r =>
    `<button type="button" data-rice-algo="${r.id}" class="lab-btn ${r.id === state.riceAlgo ? 'active' : ''} px-3 py-1.5 text-xs">${r.title}</button>`
  ).join('');
  const r = RICE_ALGOS.find(x => x.id === state.riceAlgo) || RICE_ALGOS[0];
  document.getElementById('rice-algo-detail').innerHTML = `
    <div class="font-display text-lg font-bold mb-2">${r.title}</div>
    <ol class="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-muted">
      ${r.steps.map(st => `<li>${st}</li>`).join('')}
    </ol>
  `;
}

// Chapter 8 Renderers
function renderBiryaniGantt() {
  const wrap = document.getElementById('biryani-gantt');
  wrap.innerHTML = BIRYANI_TRACKS.map(t => {
    const done = state.biryaniChecked.has(t.id);
    return `
      <div class="lab-subpanel p-2.5" style="border-left:4px solid ${t.color};">
        <div class="flex items-start justify-between gap-2">
          <label class="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm">
            <input type="checkbox" data-biryani-check="${t.id}" ${done ? 'checked' : ''} class="w-4 h-4 mt-0.5 accent-red-700 shrink-0" />
            <span class="${done ? 'line-through text-muted' : ''}"><strong>${t.track}:</strong> ${t.task}</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
  document.getElementById('biryani-progress').textContent = `${state.biryaniChecked.size} / ${BIRYANI_TRACKS.length} DONE`;
  const pct = Math.round(state.biryaniChecked.size / BIRYANI_TRACKS.length * 100);
  const bar = document.getElementById('biryani-progress-bar');
  if (bar) bar.style.width = pct + '%';
  renderBiryaniGanttSvg();
  storeSet(STORE_KEYS.biryani, JSON.stringify([...state.biryaniChecked]));
}

function renderBiryaniRegions() {
  const tabs = document.getElementById('biryani-region-tabs');
  tabs.innerHTML = Object.entries(BIRYANI_REGIONS).map(([k, v]) =>
    `<button type="button" data-breg="${k}" class="lab-btn ${k === state.biryaniRegion ? 'active' : ''} px-3 py-1 text-xs">${v.name}</button>`
  ).join('');
  const r = BIRYANI_REGIONS[state.biryaniRegion];
  document.getElementById('biryani-region-detail').innerHTML = `
    <div class="lab-subpanel p-4"><div class="text-xs font-mono-lab text-muted mb-1">RICE LAYER</div><p class="text-xs sm:text-sm">${r.rice}</p></div>
    <div class="lab-subpanel p-4"><div class="text-xs font-mono-lab text-muted mb-1">MEAT / PROTEIN</div><p class="text-xs sm:text-sm">${r.meat}</p></div>
    <div class="lab-subpanel p-4"><div class="text-xs font-mono-lab text-muted mb-1">MASALA MILK</div><p class="text-xs sm:text-sm">${r.milk}</p></div>
    <div class="lab-subpanel p-4"><div class="text-xs font-mono-lab text-muted mb-1">SPECIAL STUFF</div><p class="text-xs sm:text-sm">${r.special}</p></div>
  `;
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerSeconds / 60);
  const s = state.timerSeconds % 60;
  const txt = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = txt;
  document.getElementById('timer-label').textContent = state.timerLabel;
  const ring = document.getElementById('timer-ring');
  if (ring) {
    const C = 2 * Math.PI * 52;
    const frac = state.timerInitial ? state.timerSeconds / state.timerInitial : 0;
    ring.style.strokeDasharray = `${C}`;
    ring.style.strokeDashoffset = `${C * (1 - frac)}`;
  }
  document.title = state.timerHandle ? `⏱ ${txt} · ${state.timerLabel} | Masala Lab Atlas` : BASE_TITLE;
}

function timerBeep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    [0, 0.35, 0.7].forEach(off => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + off);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + off + 0.28);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + off); o.stop(ctx.currentTime + off + 0.3);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch (e) {}
}

function stopTimer() {
  clearInterval(state.timerHandle);
  state.timerHandle = null;
  document.getElementById('timer-start-btn')?.classList.add('active');
}

function startTimer() {
  if (state.timerHandle) return;
  if (state.timerSeconds <= 0) state.timerSeconds = state.timerInitial;
  // Wall-clock based so background-tab throttling can't make it drift.
  state.timerEndsAt = Date.now() + state.timerSeconds * 1000;
  const tick = () => {
    state.timerSeconds = Math.max(0, Math.round((state.timerEndsAt - Date.now()) / 1000));
    updateTimerDisplay();
    if (state.timerSeconds <= 0) {
      stopTimer();
      updateTimerDisplay();
      timerBeep();
      showToast(`Done! ${state.timerLabel} finished.`);
    }
  };
  state.timerHandle = setInterval(tick, 250);
  tick();
}

function renderChapattiLog() {
  const tbody = document.getElementById('chapatti-log-body');
  if (!state.logs.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-muted">No experiments logged yet. Add your first A/B test above!</td></tr>`;
    return;
  }
  tbody.innerHTML = state.logs.map(row => {
    const hydN = row.base > 0 ? Math.round((row.liquid / row.base) * 100) : null;
    const hyd = hydN === null ? '—' : hydN + '%';
    return `
      <tr class="border-b" style="border-color:var(--border-subtle);">
        <td class="py-2.5 pr-3 font-mono-lab text-xs text-muted">${escapeHTML(row.date)}</td>
        <td class="py-2.5 pr-3 font-semibold">${escapeHTML(row.dish)}</td>
        <td class="py-2.5 pr-3 font-mono-lab">${row.base}g</td>
        <td class="py-2.5 pr-3 font-mono-lab">${row.liquid}g</td>
        <td class="py-2.5 pr-3"><span class="hyd-meter" style="--h:${Math.min(130, hydN || 0) / 1.3}%"></span><span class="amber-pill px-2 py-0.5 text-xs font-mono-lab">${hyd}</span></td>
        <td class="py-2.5 pr-3">${escapeHTML(row.outcome)}</td>
        <td class="py-2.5 text-right"><button type="button" data-del-log="${escapeHTML(row.id)}" class="text-xs underline text-muted cursor-pointer" aria-label="Delete entry ${escapeHTML(row.dish)}">Delete</button></td>
      </tr>
    `;
  }).join('');
}

/* =====================================================================
   NAVIGATION & THEME SWITCHING
===================================================================== */
const BASE_TITLE = document.title;
const VALID_TABS = ['overview', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8'];

function switchTab(tabId, opts = {}) {
  if (!VALID_TABS.includes(tabId)) tabId = 'overview';
  state.tab = tabId;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`panel-${tabId}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === tabId;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
    if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
  if (!opts.fromHash) {
    const hash = tabId === 'overview' ? '' : `#${tabId}`;
    if (location.hash !== hash) history.pushState(null, '', hash || location.pathname + location.search);
  }
  if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

  // Animations only run while visible
  if (tabId === 'ch1') startKinetics(); else stopKinetics();
  if (tabId === 'ch6') startMicrowave(); else stopMicrowave();

  // Charts/canvases need a visible container to size correctly
  setTimeout(() => {
    if (tabId === 'ch1') { renderFatChart(); renderBoilingLab(); drawKineticsFrame(0); }
    if (tabId === 'ch2') { renderScovilleChart(); renderMoleculeViewer(); renderCapsaicin(); }
    if (tabId === 'ch3') renderMaillardStructures();
    if (tabId === 'ch5') renderUmamiModel();
    if (tabId === 'ch6') renderSousVideChart();
  }, 30);
}

/** Jump to a specific tool: switch chapter (and generator sub-tab), then scroll + flash it. */
function gotoSection(secId) {
  const sec = SECTION_INDEX.find(s => s.id === secId);
  if (!sec) return;
  switchTab(sec.tab, { keepScroll: true });
  if (sec.gen) selectGenerator(sec.gen);
  setTimeout(() => {
    const el = document.getElementById(sec.id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    el.classList.remove('flash-target'); void el.offsetWidth; el.classList.add('flash-target');
  }, 60);
}

function selectGenerator(key) {
  state.genSubtab = key;
  document.querySelectorAll('[data-gen]').forEach(b => {
    const on = b.dataset.gen === key;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  ['gravy', 'bread', 'chutney', 'salad', 'rice'].forEach(k => {
    document.getElementById(`gen-panel-${k}`).classList.toggle('hidden', k !== key);
  });
}

/* =====================================================================
   COMMAND PALETTE (Ctrl/⌘ + K, or "/")
===================================================================== */
const palette = { open: false, idx: 0, results: [] };

function openPalette() {
  const dlg = document.getElementById('cmd-palette');
  if (!dlg) return;
  palette.open = true;
  palette.lastFocus = document.activeElement;
  dlg.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('cmd-input');
  input.value = '';
  renderPalette('');
  input.focus();
}
function closePalette() {
  const dlg = document.getElementById('cmd-palette');
  if (!dlg || !palette.open) return;
  palette.open = false;
  dlg.classList.add('hidden');
  document.body.style.overflow = '';
  if (palette.lastFocus && palette.lastFocus.focus) palette.lastFocus.focus();
}
function renderPalette(q) {
  const list = document.getElementById('cmd-results');
  const chapterRows = CHAPTER_CARDS.map(c => ({ id: c.id, tab: c.id, title: `Chapter ${c.num} · ${c.title}`, kw: c.summary + ' ' + c.tag, chapter: true }));
  const pool = [...chapterRows, ...SECTION_INDEX];
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  palette.results = terms.length
    ? pool.filter(r => terms.every(t => (r.title + ' ' + r.kw).toLowerCase().includes(t)))
    : pool.slice(0, 12);
  palette.idx = 0;
  list.innerHTML = palette.results.length ? palette.results.map((r, i) => `
    <li role="option" id="cmd-opt-${i}" aria-selected="${i === 0}" data-cmd-idx="${i}" class="cmd-row ${i === 0 ? 'is-active' : ''}">
      <span class="font-mono-lab text-[10px] px-1.5 py-0.5 rounded" style="background:var(--accent-soft);color:var(--accent)">${r.tab.toUpperCase()}</span>
      <span class="flex-1 truncate">${escapeHTML(r.title)}</span>
      <span class="text-muted text-xs">${r.chapter ? 'chapter' : 'tool'}</span>
    </li>`).join('') : `<li class="p-4 text-sm text-muted">No tools match “${escapeHTML(q)}”.</li>`;
}
function movePalette(d) {
  if (!palette.results.length) return;
  palette.idx = (palette.idx + d + palette.results.length) % palette.results.length;
  document.querySelectorAll('.cmd-row').forEach((el, i) => {
    el.classList.toggle('is-active', i === palette.idx);
    el.setAttribute('aria-selected', i === palette.idx ? 'true' : 'false');
  });
  document.getElementById(`cmd-opt-${palette.idx}`)?.scrollIntoView({ block: 'nearest' });
  document.getElementById('cmd-input').setAttribute('aria-activedescendant', `cmd-opt-${palette.idx}`);
}
function choosePalette(i) {
  const r = palette.results[i];
  if (!r) return;
  closePalette();
  if (r.chapter) switchTab(r.tab); else gotoSection(r.id);
}

/* =====================================================================
   INITIALIZATION & EVENT DELEGATION
===================================================================== */
function init() {
  state.logs = loadLogs();
  try {
    const saved = JSON.parse(storeGet(STORE_KEYS.biryani) || '[]');
    if (Array.isArray(saved)) state.biryaniChecked = new Set(saved.filter(id => BIRYANI_TRACKS.some(t => t.id === id)));
  } catch (e) {}
  state.viewMolecule = 'Cinnamaldehyde';
  initKinetics();
  bindThermoBand();
  bindPhSvg();
  renderMaillardPathway();
  document.getElementById('alt-presets').innerHTML = ALTITUDE_PRESETS.map(a =>
    `<button type="button" data-alt="${a.m}" class="lab-btn px-2.5 py-1 text-xs">${a.name} <span class="text-muted font-mono-lab">${a.m}m</span></button>`).join('');

  // Populate static selects
  document.getElementById('bread-type').innerHTML = BREADS_DATA.map((b, i) => `<option value="${i}">${b.name}</option>`).join('');
  document.getElementById('brine-cut').innerHTML = BRINE_CUTS.map((c, i) => `<option value="${i}">${c.name} (${c.mins}m)</option>`).join('');
  document.getElementById('molecule-filters').innerHTML = KEY_MOLECULES.map(m =>
    `<button type="button" data-mol-filter="${m}" class="lab-btn ${m === 'All' ? 'active' : ''} px-2.5 py-1 text-xs font-mono-lab">${m}</button>`
  ).join('');

  // Initial renders
  renderOverviewBento();
  renderThermalMilestones();
  updateThermal(121);
  document.getElementById('quad-detail').innerHTML = QUADRANT_INFO['dry-fast'];
  renderPressureList();
  renderCookwareList();
  renderSpiceNetwork();
  renderTasteMap();
  renderBlends();
  renderOnionSimulator();
  renderAlliumCut();
  renderFryDiagnostic();
  renderMaillardCards();
  renderPhScale();
  renderAcidCards();
  renderUmami();
  renderMyths();
  renderAlcohol();
  renderMicrowaveSvg();
  renderGravyStack();
  renderBreadCalc();
  renderBrineCalc();
  renderChutneyGen();
  renderSaladGen();
  renderRiceAlgos();
  renderBiryaniGantt();
  renderBiryaniRegions();
  updateTimerDisplay();
  renderChapattiLog();

  // Global delegated click listener
  document.addEventListener('click', (e) => {
    const gotoBtn = e.target.closest('[data-goto]');
    if (gotoBtn) return gotoSection(gotoBtn.dataset.goto);

    if (e.target.closest('[data-open-palette]')) return openPalette();
    if (e.target.closest('[data-close-palette]')) return closePalette();
    const cmdRow = e.target.closest('[data-cmd-idx]');
    if (cmdRow) return choosePalette(Number(cmdRow.dataset.cmdIdx));

    const altBtn = e.target.closest('[data-alt]');
    if (altBtn) {
      document.getElementById('alt-slider').value = altBtn.dataset.alt;
      return renderBoilingLab();
    }

    const viewMol = e.target.closest('[data-view-mol]');
    if (viewMol) {
      state.viewMolecule = viewMol.dataset.viewMol;
      return renderMoleculeViewer();
    }

    const ganttBar = e.target.closest('[data-biryani-toggle]');
    if (ganttBar) {
      const id = ganttBar.dataset.biryaniToggle;
      if (state.biryaniChecked.has(id)) state.biryaniChecked.delete(id); else state.biryaniChecked.add(id);
      return renderBiryaniGantt();
    }


    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) return switchTab(tabBtn.dataset.tab);

    const jumpBtn = e.target.closest('[data-jump]');
    if (jumpBtn) return switchTab(jumpBtn.dataset.jump);

    if (e.target.closest('#brand-home-btn')) return switchTab('overview');

    const tempPill = e.target.closest('[data-temp-pill]');
    if (tempPill) {
      document.getElementById('thermal-slider').value = tempPill.dataset.tempPill;
      return updateThermal(tempPill.dataset.tempPill);
    }

    const quadBtn = e.target.closest('[data-quad]');
    if (quadBtn) {
      document.getElementById('quad-detail').innerHTML = QUADRANT_INFO[quadBtn.dataset.quad];
      return;
    }

    const pcCat = e.target.closest('[data-pc-cat]');
    if (pcCat) {
      state.pcCat = pcCat.dataset.pcCat;
      document.querySelectorAll('[data-pc-cat]').forEach(b => b.classList.toggle('active', b === pcCat));
      return renderPressureList();
    }

    const fatBtn = e.target.closest('[data-fat-filter]');
    if (fatBtn) {
      state.fatFilter = fatBtn.dataset.fatFilter;
      document.querySelectorAll('[data-fat-filter]').forEach(b => b.classList.toggle('active', b === fatBtn));
      return renderFatChart();
    }

    const molBtn = e.target.closest('[data-mol-filter]');
    if (molBtn) {
      state.selectedMolecule = molBtn.dataset.molFilter;
      document.querySelectorAll('[data-mol-filter]').forEach(b => b.classList.toggle('active', b === molBtn));
      return renderSpiceNetwork();
    }

    const spiceNode = e.target.closest('[data-spice-node]');
    if (spiceNode) {
      state.selectedSpice = spiceNode.dataset.spiceNode;
      state.selectedMolecule = 'All';
      document.querySelectorAll('[data-mol-filter]').forEach(b => b.classList.toggle('active', b.dataset.molFilter === 'All'));
      return renderSpiceNetwork();
    }

    const addSpice = e.target.closest('[data-spice-add]');
    if (addSpice) {
      const id = addSpice.dataset.spiceAdd;
      if (state.customMasala.includes(id)) {
        state.customMasala = state.customMasala.filter(x => x !== id);
      } else {
        state.customMasala.push(id);
      }
      return renderSpiceNetwork();
    }

    const remSpice = e.target.closest('[data-remove-spice]');
    if (remSpice) {
      state.customMasala = state.customMasala.filter(x => x !== remSpice.dataset.removeSpice);
      return renderSpiceNetwork();
    }

    if (e.target.closest('#clear-masala-btn')) {
      state.customMasala = [];
      return renderSpiceNetwork();
    }

    const tasteBtn = e.target.closest('[data-taste-conc]');
    if (tasteBtn) {
      state.tasteConc = tasteBtn.dataset.tasteConc;
      document.querySelectorAll('[data-taste-conc]').forEach(b => b.classList.toggle('active', b === tasteBtn));
      return renderTasteMap();
    }

    const scovBtn = e.target.closest('[data-scoville-scale]');
    if (scovBtn) {
      state.scovilleScale = scovBtn.dataset.scovilleScale;
      document.querySelectorAll('[data-scoville-scale]').forEach(b => b.classList.toggle('active', b === scovBtn));
      return renderScovilleChart();
    }

    const blendBtn = e.target.closest('[data-blend]');
    if (blendBtn) {
      state.selectedBlend = blendBtn.dataset.blend;
      return renderBlends();
    }

    const cutBtn = e.target.closest('[data-allium-cut]');
    if (cutBtn) {
      state.alliumCut = cutBtn.dataset.alliumCut;
      document.querySelectorAll('[data-allium-cut]').forEach(b => b.classList.toggle('active', b === cutBtn));
      return renderAlliumCut();
    }

    const phBtn = e.target.closest('[data-ph-id]');
    if (phBtn) {
      state.selectedPh = phBtn.dataset.phId;
      return renderPhScale();
    }

    const acidRoleBtn = e.target.closest('[data-acid-role]');
    if (acidRoleBtn) {
      state.acidRole = acidRoleBtn.dataset.acidRole;
      document.querySelectorAll('[data-acid-role]').forEach(b => b.classList.toggle('active', b === acidRoleBtn));
      return renderAcidCards();
    }

    const mythCard = e.target.closest('[data-myth-id]');
    if (mythCard) {
      const id = mythCard.dataset.mythId;
      if (state.revealedMyths.has(id)) state.revealedMyths.delete(id);
      else state.revealedMyths.add(id);
      return renderMyths();
    }

    const alcBtn = e.target.closest('[data-alc]');
    if (alcBtn) {
      state.selectedAlcohol = alcBtn.dataset.alc;
      return renderAlcohol();
    }

    const papadBtn = e.target.closest('[data-papad]');
    if (papadBtn) {
      state.papadMode = papadBtn.dataset.papad;
      document.querySelectorAll('[data-papad]').forEach(b => b.classList.toggle('active', b === papadBtn));
      return renderMicrowaveSvg();
    }

    const svBtn = e.target.closest('[data-sv-filter]');
    if (svBtn) {
      state.svFilter = svBtn.dataset.svFilter;
      document.querySelectorAll('[data-sv-filter]').forEach(b => b.classList.toggle('active', b === svBtn));
      return renderSousVideChart();
    }

    const genBtn = e.target.closest('[data-gen]');
    if (genBtn) {
      return selectGenerator(genBtn.dataset.gen);
    }

    if (e.target.closest('#random-chutney-btn')) {
      CHUTNEY_COLS.forEach(c => {
        state.chutney[c.key] = c.opts[Math.floor(Math.random() * c.opts.length)];
      });
      return renderChutneyGen();
    }

    if (e.target.closest('#random-salad-btn')) {
      SALAD_COLS.forEach(c => {
        state.salad[c.key] = c.opts[Math.floor(Math.random() * c.opts.length)];
      });
      return renderSaladGen();
    }

    const riceBtn = e.target.closest('[data-rice-algo]');
    if (riceBtn) {
      state.riceAlgo = riceBtn.dataset.riceAlgo;
      return renderRiceAlgos();
    }

    const bregBtn = e.target.closest('[data-breg]');
    if (bregBtn) {
      state.biryaniRegion = bregBtn.dataset.breg;
      return renderBiryaniRegions();
    }

    const timerPreset = e.target.closest('[data-timer-min]');
    if (timerPreset) {
      stopTimer();
      state.timerInitial = Number(timerPreset.dataset.timerMin) * 60;
      state.timerSeconds = state.timerInitial;
      state.timerLabel = timerPreset.dataset.timerName;
      updateTimerDisplay();
      showToast(`Timer set: ${state.timerLabel} (${timerPreset.dataset.timerMin}m)`);
      return;
    }

    if (e.target.closest('#timer-start-btn')) return startTimer();

    if (e.target.closest('#timer-pause-btn')) {
      stopTimer();
      return updateTimerDisplay();
    }

    if (e.target.closest('#timer-reset-btn')) {
      stopTimer();
      state.timerSeconds = state.timerInitial;
      return updateTimerDisplay();
    }

    const delLog = e.target.closest('[data-del-log]');
    if (delLog) {
      state.logs = state.logs.filter(r => r.id !== delLog.dataset.delLog);
      saveLogs();
      renderChapattiLog();
      showToast('Deleted log entry.');
      return;
    }

    if (e.target.closest('#download-log-btn')) {
      const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
      const rows = [['date', 'dish', 'base_g', 'liquid_g', 'hydration_pct', 'outcome']]
        .concat(state.logs.map(r => [r.date, r.dish, r.base, r.liquid, r.base > 0 ? Math.round(r.liquid / r.base * 100) : '', r.outcome]));
      const blob = new Blob([rows.map(r => r.map(cell).join(',')).join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'chapatti-log.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      return showToast('Downloaded chapatti-log.csv');
    }

    if (e.target.closest('#export-log-btn')) {
      const json = JSON.stringify(state.logs, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(() => showToast('Copied A/B Kitchen Log JSON to clipboard!')).catch(() => fallbackCopy(json));
      } else {
        fallbackCopy(json);
      }
    }
  });

  // Input & Change Listeners
  document.getElementById('atlas-search').addEventListener('input', (e) => renderOverviewBento(e.target.value));
  document.getElementById('thermal-slider').addEventListener('input', (e) => updateThermal(e.target.value));
  ['alt-slider', 'gauge-slider', 'cooker-toggle'].forEach(id => document.getElementById(id).addEventListener('input', renderBoilingLab));
  ['umami-u', 'umami-v'].forEach(id => document.getElementById(id).addEventListener('input', renderUmami));
  document.getElementById('cmd-input').addEventListener('input', (e) => renderPalette(e.target.value));

  // Keyboard: palette shortcuts, SVG node activation, roving tabs
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); return palette.open ? closePalette() : openPalette(); }
    if (e.key === '/' && !typing && !palette.open) { e.preventDefault(); return openPalette(); }
    if (palette.open) {
      if (e.key === 'Escape') { e.preventDefault(); return closePalette(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); return movePalette(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); return movePalette(-1); }
      if (e.key === 'Enter') { e.preventDefault(); return choosePalette(palette.idx); }
      if (e.key === 'Tab') { e.preventDefault(); return document.getElementById('cmd-input').focus(); }
      return;
    }
    const svgBtn = e.target.closest && e.target.closest('g[role="button"]');
    if (svgBtn && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      svgBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return;
    }
    const tab = e.target.closest && e.target.closest('[role="tab"][data-tab]');
    if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const tabs = [...document.querySelectorAll('[role="tab"][data-tab]')];
      const i = tabs.indexOf(tab);
      const nxt = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      switchTab(nxt.dataset.tab);
      nxt.focus();
    }
  });

  // Hash routing: deep links + back/forward
  const fromHash = () => {
    const h = location.hash.replace('#', '');
    if (VALID_TABS.includes(h)) switchTab(h, { fromHash: true });
    else if (SECTION_INDEX.some(s => s.id === h)) gotoSection(h);
    else switchTab('overview', { fromHash: true });
  };
  window.addEventListener('popstate', fromHash);
  window.addEventListener('hashchange', fromHash);
  fromHash();

  // Reading progress bar
  const prog = document.getElementById('scroll-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    document.getElementById('to-top')?.classList.toggle('is-visible', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { renderMoleculeViewer(); drawKineticsFrame(0); }, 150); });
  document.addEventListener('visibilitychange', () => { if (state.timerHandle) updateTimerDisplay(); });
  document.getElementById('pc-soda-toggle').addEventListener('change', (e) => { state.pcSoda = e.target.checked; renderPressureList(); });
  document.getElementById('acid-safe-filter').addEventListener('change', (e) => { state.acidSafeOnly = e.target.checked; renderCookwareList(); });
  document.getElementById('onion-stage-slider').addEventListener('input', (e) => { state.onionStage = Number(e.target.value); renderOnionSimulator(); });
  document.getElementById('onion-soda-toggle').addEventListener('change', (e) => { state.onionSoda = e.target.checked; renderOnionSimulator(); });
  document.getElementById('fry-temp-slider').addEventListener('input', (e) => { state.fryTemp = Number(e.target.value); renderFryDiagnostic(); });
  document.getElementById('umami-glutamate').addEventListener('change', renderUmami);
  document.getElementById('umami-nucleotide').addEventListener('change', renderUmami);

  ['gravy-main', 'gravy-region', 'gravy-alcohol', 'gravy-base', 'gravy-smoke'].forEach(id => {
    document.getElementById(id).addEventListener('change', renderGravyStack);
  });
  ['bread-type', 'bread-flour'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderBreadCalc);
  });
  ['brine-cut', 'brine-water'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderBrineCalc);
  });

  document.getElementById('chutney-controls').addEventListener('change', (e) => {
    if (e.target.dataset.chutneyKey) {
      state.chutney[e.target.dataset.chutneyKey] = e.target.value;
      renderChutneyGen();
    }
  });
  document.getElementById('salad-controls').addEventListener('change', (e) => {
    if (e.target.dataset.saladKey) {
      state.salad[e.target.dataset.saladKey] = e.target.value;
      renderSaladGen();
    }
  });
  document.getElementById('biryani-gantt').addEventListener('change', (e) => {
    if (e.target.dataset.biryaniCheck) {
      const id = e.target.dataset.biryaniCheck;
      if (e.target.checked) state.biryaniChecked.add(id);
      else state.biryaniChecked.delete(id);
      renderBiryaniGantt();
    }
  });

  document.getElementById('chapatti-log-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const dish = document.getElementById('log-dish').value.trim();
    const base = Number(document.getElementById('log-var-a').value) || 0;
    const liquid = Number(document.getElementById('log-var-b').value) || 0;
    const outcome = document.getElementById('log-outcome').value.trim();
    if (!dish || !outcome) return;
    const today = new Date().toISOString().slice(0, 10);
    state.logs.unshift({ id: 'l_' + Date.now(), date: today, dish, base, liquid, outcome });
    saveLogs();
    renderChapattiLog();
    document.getElementById('log-dish').value = '';
    document.getElementById('log-outcome').value = '';
    showToast('Saved new kitchen A/B experiment!');
  });
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Copied A/B Kitchen Log JSON to clipboard!');
  } catch (e) {
    showToast('Could not copy automatically.');
  }
  document.body.removeChild(ta);
}

document.addEventListener('DOMContentLoaded', init);
