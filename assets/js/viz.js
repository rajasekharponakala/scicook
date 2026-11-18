/* =====================================================================
   SCIENCE VISUALISATION LAYER
   Molecular structures, kinetic particles, phase diagrams, pH physics,
   umami synergy kinetics, standing waves and the biryani Gantt.
   Depends on: data.js (datasets), app.js (state, helpers), Chart.js,
   SmilesDrawer (both optional — every viz degrades gracefully).
===================================================================== */

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cssVar(name, fallback = '#888') {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/* ---------------------------------------------------------------------
   1. MOLECULE LIBRARY (SMILES) + STRUCTURE RENDERER
--------------------------------------------------------------------- */
const MOLECULE_LIBRARY = {
  'Cinnamaldehyde': { smiles: 'O=C/C=C/c1ccccc1', cls: 'Phenylpropanoid aldehyde', formula: 'C9H8O' },
  'Linalool': { smiles: 'CC(C)=CCCC(C)(O)C=C', cls: 'Monoterpene alcohol', formula: 'C10H18O' },
  'Eugenol': { smiles: 'COc1cc(CC=C)ccc1O', cls: 'Phenylpropene (phenol)', formula: 'C10H12O2' },
  'Caryophyllene': { smiles: 'CC1=CCCC(=C)C2CC(C)(C)C2CC1', cls: 'Bicyclic sesquiterpene', formula: 'C15H24' },
  'Anethole': { smiles: 'COc1ccc(/C=C/C)cc1', cls: 'Phenylpropene ether', formula: 'C10H12O' },
  'Cineole': { smiles: 'CC12CCC(CC1)C(C)(C)O2', cls: 'Monoterpene ether (eucalyptol)', formula: 'C10H18O' },
  'Phellandrene': { smiles: 'CC1=CCC(C(C)C)C=C1', cls: 'Cyclic monoterpene', formula: 'C10H16' },
  'Limonene': { smiles: 'CC1=CCC(CC1)C(=C)C', cls: 'Cyclic monoterpene', formula: 'C10H16' },
  'Pinene': { smiles: 'CC1=CCC2CC1C2(C)C', cls: 'Bicyclic monoterpene', formula: 'C10H16' },
  'Myristicin': { smiles: 'COc1cc(CC=C)cc2OCOc12', cls: 'Phenylpropene', formula: 'C11H12O3' },
  'Geraniol': { smiles: 'CC(C)=CCC/C(C)=C/CO', cls: 'Monoterpene alcohol', formula: 'C10H18O' },
  'Sabinene': { smiles: 'CC(C)C12CCC(=C)C1C2', cls: 'Bicyclic monoterpene', formula: 'C10H16' },
  'Terpineol': { smiles: 'CC1=CCC(CC1)C(C)(C)O', cls: 'Monoterpene alcohol', formula: 'C10H18O' },
  'Safrole': { smiles: 'C=CCc1ccc2OCOc2c1', cls: 'Phenylpropene', formula: 'C10H10O2' },
  'S-Carvone': { smiles: 'CC1=CCC(CC1=O)C(=C)C', cls: 'Monoterpene ketone', formula: 'C10H14O' },
  'Cymene': { smiles: 'Cc1ccc(cc1)C(C)C', cls: 'Aromatic monoterpene', formula: 'C10H14' },
  'Cuminaldehyde': { smiles: 'CC(C)c1ccc(C=O)cc1', cls: 'Aromatic aldehyde', formula: 'C10H12O' },
  'Nigellone': { smiles: 'CC1=CC(=O)C(=CC1=O)C(C)C', cls: 'Shown: thymoquinone (nigellone is its dimer)', formula: 'C10H12O2' },
  'a-Fenchyl Acetate': { smiles: 'CC(=O)OC1C(C)(C)C2CCC1(C)C2', cls: 'Monoterpene ester', formula: 'C12H20O2' },
  'Citral': { smiles: 'CC(C)=CCC/C(C)=C/C=O', cls: 'Monoterpene aldehyde', formula: 'C10H16O' },
  'Myrcene': { smiles: 'CC(C)=CCCC(=C)C=C', cls: 'Acyclic monoterpene', formula: 'C10H16' },
  'Sulphides': { smiles: 'CCC(C)SS/C=C/C', cls: 'Shown: sec-butyl propenyl disulfide', formula: 'C7H14S2' },
  'Organic Acids': { smiles: 'COc1cc(/C=C/C(=O)O)ccc1O', cls: 'Shown: ferulic acid', formula: 'C10H10O4' },
  '1-Phenylethanethiol': { smiles: 'CC(S)c1ccccc1', cls: 'Aromatic thiol', formula: 'C8H10S' },
  'Isothiocyanates': { smiles: 'C=CCN=C=S', cls: 'Shown: allyl isothiocyanate', formula: 'C4H5NS' },
  'Pyrazines': { smiles: 'Cc1cnc(C)cn1', cls: 'Shown: 2,5-dimethylpyrazine', formula: 'C6H8N2' },
  'Piperine': { smiles: 'O=C(/C=C/C=C/c1ccc2OCOc2c1)N1CCCCC1', cls: 'Alkaloid amide', formula: 'C17H19NO3' },
  'Gingerol': { smiles: 'CCCCCC(O)CC(=O)CCc1ccc(O)c(OC)c1', cls: 'Phenolic ketone ([6]-gingerol)', formula: 'C17H26O4' },
  'Picrocrocin': { smiles: 'CC1=C(C=O)C(C)(C)CC(C1)OC1OC(CO)C(O)C(O)C1O', cls: 'Monoterpene glycoside', formula: 'C16H26O7' },
  'Safranal': { smiles: 'CC1=C(C=O)C(C)(C)CC=C1', cls: 'Monoterpene aldehyde', formula: 'C10H14O' },
  'Hexanal': { smiles: 'CCCCCC=O', cls: 'Aliphatic aldehyde', formula: 'C6H12O' },
  'Vinyl Amyl Ketone': { smiles: 'CCCCCC(=O)C=C', cls: '1-Octen-3-one', formula: 'C8H14O' },
  'Thymol': { smiles: 'Cc1ccc(C(C)C)c(O)c1', cls: 'Monoterpene phenol', formula: 'C10H14O' },
  'Turmerone': { smiles: 'CC(CC(=O)C=C(C)C)c1ccc(C)cc1', cls: 'ar-Turmerone (sesquiterpene ketone)', formula: 'C15H20O' },
  'Zingiberene': { smiles: 'CC1=CCC(C=C1)C(C)CCC=C(C)C', cls: 'Sesquiterpene', formula: 'C15H24' },
  'Sotolon': { smiles: 'CC1OC(=O)C(O)=C1C', cls: 'Furanone lactone', formula: 'C6H8O3' },
  // Non-spice molecules used across the atlas
  'Capsaicin': { smiles: 'COc1cc(CNC(=O)CCCC/C=C/C(C)C)ccc1O', cls: 'Vanilloid alkaloid · TRPV1 agonist', formula: 'C18H27NO3' },
  'Glutamate': { smiles: 'NC(CCC(=O)[O-])C(=O)O', cls: 'Amino acid anion · T1R1/T1R3 ligand', formula: 'C5H8NO4⁻' },
  'Allicin': { smiles: 'C=CCS(=O)SCC=C', cls: 'Thiosulfinate (crushed garlic)', formula: 'C6H10OS2' },
  'Propanethial S-oxide': { smiles: 'CCC=S=O', cls: 'Lachrymatory factor (onion tears)', formula: 'C3H6OS' },
  'Furfural': { smiles: 'O=Cc1ccco1', cls: 'Furan aldehyde', formula: 'C5H4O2' },
  'Furaneol': { smiles: 'CC1OC(C)=C(O)C1=O', cls: 'Furanone (caramel/strawberry)', formula: 'C6H8O3' },
  '2-Acetylpyrrole': { smiles: 'CC(=O)c1ccc[nH]1', cls: 'Pyrrole (nutty, bready)', formula: 'C6H7NO' },
  '2-Acetylthiophene': { smiles: 'CC(=O)c1cccs1', cls: 'Thiophene (roasted, meaty)', formula: 'C6H6OS' },
  'Acrylamide': { smiles: 'C=CC(N)=O', cls: 'Over-browning by-product (asparagine + sugar)', formula: 'C3H5NO' }
};

const MAILLARD_REPRESENTATIVE = {
  'Furans': 'Furfural',
  'Furanones': 'Furaneol',
  'Oxazoles & Pyrroles': '2-Acetylpyrrole',
  'Thiophenes': '2-Acetylthiophene',
  'Pyrazines': 'Pyrazines',
  'Melanoidins': 'Acrylamide'
};

function formulaHtml(f) {
  return String(f).replace(/(\d+)/g, '<sub>$1</sub>');
}

/** Draw a molecule's skeletal formula into a canvas. Returns true on success. */
function drawMolecule(canvas, name, opts = {}) {
  if (!canvas) return false;
  const mol = MOLECULE_LIBRARY[name];
  const width = opts.width || canvas.clientWidth || 260;
  const height = opts.height || canvas.clientHeight || 170;
  const ctx = canvas.getContext('2d');
  const fail = (msg) => {
    canvas.width = width; canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = cssVar('--text-muted', '#64748b');
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(msg, width / 2, height / 2);
    return false;
  };
  if (!mol) return fail('Structure not available');
  if (typeof SmilesDrawer === 'undefined') return fail('Structure viewer offline');
  try {
    const drawer = new SmilesDrawer.Drawer({
      width, height, padding: opts.padding ?? 14, bondThickness: 1.15,
      fontSizeLarge: 7, fontSizeSmall: 5, compactDrawing: false, terminalCarbons: false
    });
    const theme = state.theme === 'dark' ? 'dark' : 'light';
    let ok = true;
    SmilesDrawer.parse(mol.smiles, (tree) => drawer.draw(tree, canvas, theme, false), () => { ok = false; });
    if (!ok) return fail('Could not parse structure');
    return true;
  } catch (e) {
    return fail('Could not draw structure');
  }
}

/* ---------------------------------------------------------------------
   2. CH1 · THERMOMETER BAND + KINETIC MOLECULE SIMULATION
--------------------------------------------------------------------- */
const THERMAL_ZONES = [
  { from: 0, to: 50, name: 'Ambient & fermentation', color: '#38bdf8' },
  { from: 50, to: 70, name: 'Protein denaturation', color: '#a78bfa' },
  { from: 70, to: 100, name: 'Starch gelatinization', color: '#34d399' },
  { from: 100, to: 121, name: 'Boil → pressure', color: '#22d3ee' },
  { from: 121, to: 170, name: 'Maillard browning', color: '#f59e0b' },
  { from: 170, to: 192, name: 'Deep-fry window', color: '#f97316' },
  { from: 192, to: 270, name: 'Fat smoke points', color: '#ef4444' },
  { from: 270, to: 480, name: 'Tandoor / char', color: '#991b1b' }
];
const THERMO_MAX = 480;

function renderThermoBand(temp) {
  const svg = document.getElementById('thermo-band');
  if (!svg) return;
  const W = 1000, x0 = 10, x1 = 990, y = 34, h = 26;
  const sx = (t) => x0 + (t / THERMO_MAX) * (x1 - x0);
  const zones = THERMAL_ZONES.map(z => {
    const a = sx(z.from), b = sx(z.to);
    const active = temp >= z.from && temp < z.to || (temp === THERMO_MAX && z.to === THERMO_MAX);
    return `<rect x="${a}" y="${y}" width="${b - a}" height="${h}" fill="${z.color}" opacity="${active ? 1 : 0.42}">
              <title>${z.name}: ${z.from}–${z.to}°C</title></rect>`;
  }).join('');
  const ticks = THERMAL_MILESTONES.map((m, i) => {
    const x = sx(m.t);
    const up = i % 2 === 0;
    return `<g class="thermo-tick" data-temp-pill="${m.t}" role="button" tabindex="-1" aria-label="${m.label}">
      <line x1="${x}" y1="${up ? 22 : y + h}" x2="${x}" y2="${up ? y : y + h + 12}" stroke="var(--text-muted)" stroke-width="1" />
      <text x="${x}" y="${up ? 16 : y + h + 24}" text-anchor="middle" font-size="11" font-family="JetBrains Mono, monospace" fill="var(--text-muted)">${m.t}</text>
    </g>`;
  }).join('');
  const px = sx(temp);
  const zone = THERMAL_ZONES.find(z => temp >= z.from && temp < z.to) || THERMAL_ZONES[THERMAL_ZONES.length - 1];
  svg.innerHTML = `
    <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="6" fill="none" stroke="var(--border-subtle)" />
    ${zones}
    ${ticks}
    <g transform="translate(${px},0)" style="transition:transform .12s ease">
      <line x1="0" y1="${y - 6}" x2="0" y2="${y + h + 6}" stroke="var(--text-main)" stroke-width="3" />
      <circle cx="0" cy="${y + h / 2}" r="7" fill="#fff" stroke="var(--text-main)" stroke-width="3" />
    </g>`;
  const zl = document.getElementById('thermo-zone-label');
  if (zl) zl.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle" style="background:${zone.color}"></span>${zone.name}`;
}

function bindThermoBand() {
  const svg = document.getElementById('thermo-band');
  if (!svg) return;
  const setFromEvent = (e) => {
    const rect = svg.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const t = Math.round(Math.min(1, Math.max(0, (frac * 1000 - 10) / 980)) * THERMO_MAX);
    document.getElementById('thermal-slider').value = t;
    updateThermal(t);
  };
  let dragging = false;
  svg.addEventListener('pointerdown', (e) => { dragging = true; svg.setPointerCapture(e.pointerId); setFromEvent(e); });
  svg.addEventListener('pointermove', (e) => { if (dragging) setFromEvent(e); });
  svg.addEventListener('pointerup', () => { dragging = false; });
  svg.addEventListener('pointercancel', () => { dragging = false; });
}

/* Kinetic theory particles: v_rms = sqrt(3RT/M) for water (M = 0.018 kg/mol). */
const kinetics = { particles: [], raf: null, temp: 121, lastW: 0 };

function initKinetics() {
  const canvas = document.getElementById('kinetics-canvas');
  if (!canvas) return;
  const N = 46;
  kinetics.particles = Array.from({ length: N }, (_, i) => ({
    x: Math.random(), y: Math.random(),
    vx: Math.random() - 0.5, vy: Math.random() - 0.5,
    lx: (i % 8 + 0.5) / 8, ly: 1 - (Math.floor(i / 8) + 0.5) / 8 * 0.55
  }));
}

function waterPhase(t) {
  if (t <= 0) return 'solid';
  if (t < 100) return 'liquid';
  return 'gas';
}

function setKineticsTemp(t) {
  kinetics.temp = Number(t);
  const K = kinetics.temp + 273.15;
  const vrms = Math.sqrt(3 * 8.314 * K / 0.018);
  const phase = waterPhase(kinetics.temp);
  const read = document.getElementById('kinetics-readout');
  if (read) {
    const phaseName = { solid: 'Ice lattice (H-bonds locked)', liquid: 'Liquid water (H-bonds flicker)', gas: 'Steam / superheated vapour' }[phase];
    read.innerHTML = `<span class="font-mono-lab font-bold" style="color:var(--accent)">${Math.round(vrms)} m/s</span>
      <span class="text-muted">v<sub>rms</sub> of H₂O at ${K.toFixed(0)} K · ${phaseName}</span>`;
  }
  if (prefersReducedMotion() || !kinetics.raf) drawKineticsFrame(0);
}

function drawKineticsFrame(dt) {
  const canvas = document.getElementById('kinetics-canvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const t = kinetics.temp;
  const phase = waterPhase(t);
  const speed = Math.sqrt((t + 273.15) / 373.15) * (phase === 'gas' ? 0.55 : phase === 'liquid' ? 0.16 : 0.0);
  const zone = THERMAL_ZONES.find(z => t >= z.from && t < z.to) || THERMAL_ZONES[THERMAL_ZONES.length - 1];

  // Liquid surface
  if (phase === 'liquid') {
    ctx.fillStyle = 'rgba(56,189,248,0.12)';
    ctx.fillRect(0, h * 0.42, w, h * 0.58);
  }
  const r = Math.max(3.2, Math.min(w, h) / 46);
  kinetics.particles.forEach((p, i) => {
    if (phase === 'solid') {
      const jig = 0.004 + (t + 40) / 4000;
      p.x = p.lx + (Math.random() - 0.5) * jig;
      p.y = p.ly + (Math.random() - 0.5) * jig;
    } else {
      p.x += p.vx * speed * dt;
      p.y += p.vy * speed * dt;
      const yMin = phase === 'liquid' ? 0.45 : 0.03;
      if (p.x < 0.03) { p.x = 0.03; p.vx = Math.abs(p.vx); }
      if (p.x > 0.97) { p.x = 0.97; p.vx = -Math.abs(p.vx); }
      if (p.y < yMin) { p.y = yMin; p.vy = Math.abs(p.vy); }
      if (p.y > 0.97) { p.y = 0.97; p.vy = -Math.abs(p.vy); }
      if (phase === 'liquid') { p.vx += (Math.random() - 0.5) * 0.08; p.vy += (Math.random() - 0.5) * 0.08; }
      const m = Math.hypot(p.vx, p.vy) || 1;
      p.vx /= m; p.vy /= m;
    }
    const X = p.x * w, Y = p.y * h;
    // H2O: one O (red) + two H (white) in a 104.5° bent shape
    const a = (i * 1.7 + (phase === 'solid' ? 0 : performance.now() / 900 * (1 + i % 3))) % (Math.PI * 2);
    const hx = (k) => X + Math.cos(a + k * 0.912) * r * 1.25;
    const hy = (k) => Y + Math.sin(a + k * 0.912) * r * 1.25;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(hx(1), hy(1), r * 0.55, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(hx(-1), hy(-1), r * 0.55, 0, 7); ctx.fill();
    ctx.fillStyle = zone.color;
    ctx.beginPath(); ctx.arc(X, Y, r, 0, 7); ctx.fill();
  });
  if (phase === 'solid') {
    ctx.strokeStyle = 'rgba(56,189,248,0.35)';
    ctx.setLineDash([3, 3]);
    kinetics.particles.forEach((p, i) => {
      const q = kinetics.particles[i + 1];
      if (q && Math.abs(q.ly - p.ly) < 0.01) { ctx.beginPath(); ctx.moveTo(p.x * w, p.y * h); ctx.lineTo(q.x * w, q.y * h); ctx.stroke(); }
    });
    ctx.setLineDash([]);
  }
}

function startKinetics() {
  if (kinetics.raf || prefersReducedMotion()) { drawKineticsFrame(0); return; }
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    drawKineticsFrame(dt);
    kinetics.raf = requestAnimationFrame(loop);
  };
  kinetics.raf = requestAnimationFrame(loop);
}
function stopKinetics() { if (kinetics.raf) cancelAnimationFrame(kinetics.raf); kinetics.raf = null; }

/* ---------------------------------------------------------------------
   3. CH1 · BOILING POINT vs PRESSURE (Antoine equation)
--------------------------------------------------------------------- */
const ALTITUDE_PRESETS = [
  { name: 'Chennai / Mumbai', m: 0 },
  { name: 'Bengaluru', m: 920 },
  { name: 'Shimla', m: 2276 },
  { name: 'Leh', m: 3500 },
  { name: 'Everest base camp', m: 5364 }
];
let boilChart = null;

function pressureAtAltitudeKPa(m) {
  return 101.325 * Math.pow(1 - 2.25577e-5 * m, 5.25588);
}
function boilingPointC(kPa) {
  const mmHg = kPa * 7.50062;
  const lp = Math.log10(mmHg);
  const low = 1730.63 / (8.07131 - lp) - 233.426;
  if (low <= 100) return low;
  return 1810.94 / (8.14019 - lp) - 244.485;
}

function renderBoilingLab() {
  const altEl = document.getElementById('alt-slider');
  if (!altEl) return;
  const alt = Number(altEl.value);
  const cooker = document.getElementById('cooker-toggle').checked;
  const gauge = Number(document.getElementById('gauge-slider').value);
  const pAtm = pressureAtAltitudeKPa(alt);
  const pAbs = pAtm + (cooker ? gauge : 0);
  const bp = boilingPointC(pAbs);
  const seaBp = 100;
  document.getElementById('alt-readout').textContent = `${alt.toLocaleString()} m`;
  document.getElementById('gauge-readout').textContent = `+${gauge} kPa (${(gauge / 100).toFixed(2)} bar)`;
  document.getElementById('gauge-slider').disabled = !cooker;
  const delta = bp - seaBp;
  document.getElementById('boil-result').innerHTML = `
    <div class="grid grid-cols-3 gap-2 text-center">
      <div><div class="font-mono-lab text-2xl font-bold" style="color:var(--accent-3)">${pAbs.toFixed(1)}</div><div class="text-[11px] text-muted">kPa absolute</div></div>
      <div><div class="font-mono-lab text-2xl font-bold" style="color:var(--accent)">${bp.toFixed(1)}°C</div><div class="text-[11px] text-muted">water boils at</div></div>
      <div><div class="font-mono-lab text-2xl font-bold" style="color:${delta >= 0 ? 'var(--accent-2)' : '#0ea5e9'}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)}°</div><div class="text-[11px] text-muted">vs sea-level boil</div></div>
    </div>
    <p class="text-xs text-muted mt-3 leading-relaxed">${
      cooker
        ? `The sealed cooker traps steam, adding ${gauge} kPa on top of the ${pAtm.toFixed(1)} kPa outside air. Water can now stay liquid up to ${bp.toFixed(1)}°C, which is why dal softens so much faster.`
        : bp < 97
          ? `Thin mountain air (${pAtm.toFixed(1)} kPa) lets water molecules escape at only ${bp.toFixed(1)}°C. Open-pot dal and rice never get hotter than this, so they take much longer to cook. This is exactly where a pressure cooker earns its keep (p. 44).`
          : `At ${pAtm.toFixed(1)} kPa, open-pot water boils near ${bp.toFixed(1)}°C. Turning up the flame only makes more steam. The water itself gets no hotter.`
    }</p>`;

  if (typeof Chart === 'undefined') return;
  const p = getChartPalette();
  const pts = [];
  for (let kp = 30; kp <= 230; kp += 5) pts.push({ x: kp, y: boilingPointC(kp) });
  const marks = ALTITUDE_PRESETS.map(a => ({ x: pressureAtAltitudeKPa(a.m), y: boilingPointC(pressureAtAltitudeKPa(a.m)), name: a.name }));
  const data = {
    datasets: [
      { type: 'line', label: 'Boiling point of water', data: pts, borderColor: p.accent, backgroundColor: p.accent, borderWidth: 2.5, pointRadius: 0, tension: 0.35 },
      { type: 'scatter', label: 'Cities', data: marks, backgroundColor: p.teal, pointRadius: 4.5 },
      { type: 'scatter', label: 'You are here', data: [{ x: pAbs, y: bp, name: cooker ? 'Your pressure cooker' : 'Your open pot' }], backgroundColor: p.amber, borderColor: p.text, borderWidth: 2, pointRadius: 8, pointHoverRadius: 10 }
    ]
  };
  const ctx = document.getElementById('boil-chart');
  if (boilChart) boilChart.destroy();
  boilChart = new Chart(ctx, {
    data,
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { labels: { color: p.text, boxWidth: 10, font: { size: 11 } } },
        tooltip: { callbacks: { label: (c) => `${c.raw.name ? c.raw.name + ': ' : ''}${c.raw.x.toFixed(1)} kPa → ${c.raw.y.toFixed(1)}°C` } }
      },
      scales: {
        x: { type: 'linear', min: 30, max: 230, title: { display: true, text: 'Absolute pressure (kPa)', color: p.text }, ticks: { color: p.text }, grid: { color: p.grid } },
        y: { min: 65, max: 130, title: { display: true, text: 'Boiling point (°C)', color: p.text }, ticks: { color: p.text }, grid: { color: p.grid } }
      }
    }
  });
}

/* ---------------------------------------------------------------------
   4. CH3 · ONION CROSS-SECTION + MAILLARD PATHWAY
--------------------------------------------------------------------- */
function renderOnionSection(stageIdx) {
  const svg = document.getElementById('onion-section');
  if (!svg) return;
  const st = ONION_STAGES[stageIdx];
  const rings = [56, 47, 38, 29, 20, 11];
  // Outer layers brown first (more surface contact + more sugar)
  const ringFill = (i) => {
    const lag = i * 0.35;
    const s = Math.max(0, stageIdx - lag);
    const idx = Math.min(ONION_STAGES.length - 1, Math.round(s));
    return ONION_STAGES[idx].circle;
  };
  const shrink = 1 - stageIdx * 0.06;
  svg.innerHTML = `
    <defs><radialGradient id="onion-gloss" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <g transform="translate(70,66) scale(${shrink})" style="transition:transform .35s ease">
      ${rings.map((r, i) => `<ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.92}" fill="${ringFill(i)}" stroke="rgba(0,0,0,.18)" stroke-width="1.2" style="transition:fill .35s ease" />`).join('')}
      <ellipse cx="0" cy="0" rx="56" ry="51.5" fill="url(#onion-gloss)" />
      ${stageIdx >= 1 && stageIdx <= 3 ? Array.from({ length: 5 }, (_, k) => `<path class="steam-wisp" d="M ${-24 + k * 12} -58 q 6 -10 0 -20 q -6 -10 0 -20" fill="none" stroke="var(--text-muted)" stroke-width="1.6" stroke-linecap="round" opacity=".55" style="animation-delay:${k * 0.3}s" />`).join('') : ''}
    </g>`;
  const meters = [
    { k: 'Moisture', v: [100, 85, 62, 45, 32, 20][stageIdx], c: '#0ea5e9' },
    { k: 'Maillard browning', v: [0, 4, 15, 45, 75, 95][stageIdx], c: '#c2410c' },
    { k: 'Pungent sharpness', v: [100, 70, 40, 22, 12, 5][stageIdx], c: '#7c3aed' },
    { k: 'Sweetness', v: [20, 32, 48, 62, 75, 95][stageIdx], c: '#d97706' }
  ];
  const mEl = document.getElementById('onion-meters');
  if (mEl) mEl.innerHTML = meters.map(m => `
    <div>
      <div class="flex justify-between text-[11px] font-mono-lab text-muted"><span>${m.k}</span><span>${m.v}</span></div>
      <div class="h-1.5 rounded-full overflow-hidden" style="background:var(--border-subtle)"><div class="h-full rounded-full" style="width:${m.v}%;background:${m.c};transition:width .35s ease"></div></div>
    </div>`).join('') + `<p class="text-[10px] text-muted">Relative index (0–100). Shows the trend, not a lab measurement.</p>`;
  void st;
}

function renderMaillardPathway() {
  const svg = document.getElementById('maillard-pathway');
  if (!svg) return;
  const box = (x, y, w, h, title, sub, color) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--surface-strong)" stroke="${color}" stroke-width="2" />
      <text x="${x + w / 2}" y="${y + h / 2 - (sub ? 3 : -4)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--text-main)">${title}</text>
      ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 13}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${sub}</text>` : ''}
    </g>`;
  const arrow = (x1, y1, x2, y2, label) => `
    <path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="var(--text-muted)" stroke-width="1.8" marker-end="url(#mp-arr)" fill="none" class="flow-line" />
     ${label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 30}" text-anchor="middle" font-size="9.5" font-family="JetBrains Mono, monospace" fill="var(--text-muted)">${label}</text>` : ''}`;
  const fams = MAILLARD_MOLECULES.slice(0, 5);
  svg.innerHTML = `
    <defs><marker id="mp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L10 5 L0 9z" fill="var(--text-muted)"/></marker></defs>
    ${box(8, 18, 128, 46, 'Reducing sugar', 'glucose · fructose', '#d97706')}
    ${box(8, 96, 128, 46, 'Amino acid', 'free –NH₂ group', '#0f766e')}
    ${arrow(136, 41, 182, 70, '')}
    ${arrow(136, 119, 182, 90, '')}
    ${box(186, 56, 132, 48, 'N-Glycosylamine', '− H₂O (condensation)', 'var(--accent)')}
    ${arrow(318, 80, 360, 80, 'Amadori')}
    ${box(362, 56, 124, 48, 'Ketosamine', 'rearranged product', 'var(--accent)')}
    ${arrow(486, 80, 528, 80, 'Strecker')}
    ${fams.map((f, i) => box(532, 4 + i * 31, 150, 26, f.name, '', f.color)).join('')}
    ${arrow(682, 80, 716, 80, 'polymerise')}
    ${box(718, 52, 116, 56, 'Melanoidins', 'brown pigments', '#431407')}
    <text x="8" y="168" font-size="10" fill="var(--text-muted)">Needs a dry surface above ~110°C. Liquid water pins the surface at 100°C. Alkaline pH (a pinch of soda) speeds the first step.</text>`;
}

function renderMaillardStructures() {
  document.querySelectorAll('[data-maillard-canvas]').forEach(cv => {
    drawMolecule(cv, MAILLARD_REPRESENTATIVE[cv.dataset.maillardCanvas], { width: 170, height: 110, padding: 8 });
  });
}

/* ---------------------------------------------------------------------
   5. CH4 · INTERACTIVE pH PHYSICS SCALE
--------------------------------------------------------------------- */
function renderPhSvg() {
  const svg = document.getElementById('ph-svg');
  if (!svg) return;
  const x0 = 20, x1 = 980, y = 64, h = 30;
  const sx = (v) => x0 + (v / 14) * (x1 - x0);
  const sel = PH_BENCHMARKS.find(b => b.id === state.selectedPh) || PH_BENCHMARKS[3];
  const cursor = state.phCursor ?? sel.ph;
  const ticks = Array.from({ length: 15 }, (_, i) => `
    <line x1="${sx(i)}" y1="${y + h}" x2="${sx(i)}" y2="${y + h + 7}" stroke="var(--text-muted)" />
    <text x="${sx(i)}" y="${y + h + 20}" text-anchor="middle" font-size="11" font-family="JetBrains Mono, monospace" fill="var(--text-muted)">${i}</text>`).join('');
  const marks = PH_BENCHMARKS.map((b, i) => {
    const x = sx(b.ph);
    const above = i % 2 === 0;
    const active = b.id === state.selectedPh;
    const ly = above ? 20 : 150;
    return `<g class="ph-mark" data-ph-id="${b.id}" role="button" tabindex="0" aria-label="${b.label}" style="cursor:pointer">
      <line x1="${x}" y1="${above ? ly + 6 : y + h + 26}" x2="${x}" y2="${above ? y - 2 : ly - 12}" stroke="${active ? 'var(--accent)' : 'var(--text-muted)'}" stroke-width="${active ? 2 : 1}" stroke-dasharray="${active ? '' : '3 3'}" />
      <circle cx="${x}" cy="${above ? y - 4 : y + h + 4}" r="${active ? 6 : 4}" fill="${active ? 'var(--accent)' : 'var(--surface-strong)'}" stroke="var(--text-main)" stroke-width="1.5" />
      <text x="${x}" y="${ly}" text-anchor="middle" font-size="${active ? 12.5 : 11}" font-weight="${active ? 700 : 500}" fill="${active ? 'var(--text-main)' : 'var(--text-muted)'}">${b.label}</text>
    </g>`;
  }).join('');
  const cx = sx(cursor);
  svg.innerHTML = `
    <defs>
      <linearGradient id="ph-grad" x1="0" x2="1">
        <stop offset="0" stop-color="#dc2626"/><stop offset=".2" stop-color="#f97316"/><stop offset=".35" stop-color="#eab308"/>
        <stop offset=".5" stop-color="#22c55e"/><stop offset=".7" stop-color="#06b6d4"/><stop offset="1" stop-color="#4f46e5"/>
      </linearGradient>
    </defs>
    <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${h / 2}" fill="url(#ph-grad)" />
    <rect x="${sx(4.3)}" y="${y - 3}" width="${sx(4.9) - sx(4.3)}" height="${h + 6}" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="2" rx="3"><title>Balanced dish sweet spot (pH 4.3–4.9)</title></rect>
    ${ticks}${marks}
    <g id="ph-cursor" transform="translate(${cx},0)">
      <path d="M -9 ${y - 14} L 9 ${y - 14} L 0 ${y - 2} Z" fill="var(--text-main)" />
      <rect x="-1.5" y="${y}" width="3" height="${h}" fill="var(--text-main)" />
    </g>`;
  renderPhReadout(cursor);
}

function renderPhReadout(ph) {
  const el = document.getElementById('ph-readout');
  if (!el) return;
  const h = Math.pow(10, -ph);
  const vsWater = Math.pow(10, 7 - ph);
  const exp = Math.floor(Math.log10(h));
  const mant = (h / Math.pow(10, exp)).toFixed(1);
  const kind = ph < 6.5 ? 'acidic' : ph > 7.5 ? 'alkaline' : 'neutral';
  const ratio = vsWater >= 1
    ? `${vsWater >= 1000 ? Math.round(vsWater).toLocaleString() : vsWater.toFixed(vsWater < 10 ? 1 : 0)}× more H⁺ than pure water`
    : `${(1 / vsWater).toFixed(1 / vsWater < 10 ? 1 : 0)}× fewer H⁺ than pure water`;
  el.innerHTML = `
    <div><div class="text-[11px] font-mono-lab text-muted">CURSOR pH</div><div class="font-mono-lab text-2xl font-bold" style="color:var(--accent)">${ph.toFixed(1)}</div></div>
    <div><div class="text-[11px] font-mono-lab text-muted">[H₃O⁺] mol/L</div><div class="font-mono-lab text-lg font-bold">${mant}×10<sup>${exp}</sup></div></div>
    <div class="col-span-2 sm:col-span-1"><div class="text-[11px] font-mono-lab text-muted">vs WATER (${kind})</div><div class="text-sm font-semibold">${ratio}</div></div>`;
}

function bindPhSvg() {
  const svg = document.getElementById('ph-svg');
  if (!svg) return;
  let drag = false;
  const set = (e) => {
    const r = svg.getBoundingClientRect();
    const v = ((e.clientX - r.left) / r.width * 1000 - 20) / 960 * 14;
    state.phCursor = Math.round(Math.min(14, Math.max(0, v)) * 10) / 10;
    const g = document.getElementById('ph-cursor');
    if (g) g.setAttribute('transform', `translate(${20 + state.phCursor / 14 * 960},0)`);
    renderPhReadout(state.phCursor);
  };
  svg.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.ph-mark')) return;
    drag = true; svg.setPointerCapture(e.pointerId); set(e);
  });
  svg.addEventListener('pointermove', (e) => { if (drag) set(e); });
  svg.addEventListener('pointerup', () => { drag = false; });
  svg.addEventListener('keydown', (e) => {
    const mark = e.target.closest('.ph-mark');
    if (mark && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); mark.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
}

/* ---------------------------------------------------------------------
   6. CH5 · YAMAGUCHI UMAMI SYNERGY MODEL
   y = u + γ·u·v   (u = MSG, v = 5'-nucleotide, g/100 mL;
   γ ≈ 1218 for IMP, ≈ 2800 for GMP — Yamaguchi, J. Food Sci. 1967)
--------------------------------------------------------------------- */
const NUCLEOTIDE_GAMMA = { mutton: 1218, anchovy: 1218, bonito: 1218, mushroom: 2800, none: 0 };
const NUCLEOTIDE_NAME = { mutton: 'IMP', anchovy: 'IMP', bonito: 'IMP', mushroom: 'GMP', none: '—' };
let umamiChart = null;

function umamiModel() {
  const u = Number(document.getElementById('umami-u')?.value || 0.05);
  const v = Number(document.getElementById('umami-v')?.value || 0.01);
  const nKey = document.getElementById('umami-nucleotide').value;
  const g = NUCLEOTIDE_GAMMA[nKey] ?? 0;
  const vEff = g ? v : 0;
  const y = u + g * u * vEff;
  return { u, v: vEff, g, y, mult: u > 0 ? y / u : 0, nKey };
}

function renderUmamiModel() {
  const m = umamiModel();
  const uR = document.getElementById('umami-u-readout');
  const vR = document.getElementById('umami-v-readout');
  if (uR) uR.textContent = `${m.u.toFixed(3)} g/100 mL`;
  if (vR) vR.textContent = m.g ? `${m.v.toFixed(3)} g/100 mL ${NUCLEOTIDE_NAME[m.nKey]}` : 'no nucleotide';
  const vSlider = document.getElementById('umami-v');
  if (vSlider) vSlider.disabled = !m.g;
  const out = document.getElementById('umami-equation');
  if (out) out.innerHTML = `
    <div class="font-mono-lab text-xs sm:text-sm">y = u + γ·u·v = ${m.u.toFixed(3)} + ${m.g}·${m.u.toFixed(3)}·${m.v.toFixed(3)} = <strong style="color:var(--accent)">${m.y.toFixed(2)}</strong> g MSG-equivalent</div>
    <div class="text-xs text-muted mt-1">That tastes like <strong style="color:var(--text-main)">${m.mult.toFixed(1)}×</strong> the umami of the glutamate on its own.</div>`;

  if (typeof Chart === 'undefined') return;
  const p = getChartPalette();
  const total = Math.max(0.01, m.u + m.v);
  const curve = [];
  const gamma = m.g || 1218;
  for (let f = 0; f <= 100; f += 2) {
    const uu = total * (1 - f / 100), vv = total * (f / 100);
    curve.push({ x: f, y: uu + gamma * uu * vv });
  }
  const curFrac = m.g ? (m.v / total) * 100 : 0;
  const ctx = document.getElementById('umami-chart');
  if (!ctx) return;
  if (umamiChart) umamiChart.destroy();
  umamiChart = new Chart(ctx, {
    data: {
      datasets: [
        { type: 'line', label: `Synergy curve (γ=${gamma}, total ${total.toFixed(3)} g/100 mL)`, data: curve, borderColor: p.accent, backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2.5, tension: 0.3, fill: false },
        { type: 'scatter', label: 'Your mix', data: [{ x: curFrac, y: m.y }], backgroundColor: p.amber, borderColor: p.text, borderWidth: 2, pointRadius: 7 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 200 },
      plugins: { legend: { labels: { color: p.text, boxWidth: 10, font: { size: 11 } } },
        tooltip: { callbacks: { label: (c) => `${c.raw.x.toFixed(0)}% nucleotide → ${c.raw.y.toFixed(2)} g MSG-eq.` } } },
      scales: {
        x: { type: 'linear', min: 0, max: 100, title: { display: true, text: 'Share of nucleotide in the mix (%)', color: p.text }, ticks: { color: p.text }, grid: { color: p.grid } },
        y: { beginAtZero: true, title: { display: true, text: 'Umami intensity (g MSG-eq.)', color: p.text }, ticks: { color: p.text }, grid: { color: p.grid } }
      }
    }
  });
}

/* ---------------------------------------------------------------------
   7. CH6 · ANIMATED MICROWAVE STANDING WAVE + HEAT MAP
--------------------------------------------------------------------- */
const microwave = { raf: null, t0: performance.now() };

function drawMicrowaveFrame(now) {
  const svg = document.getElementById('microwave-svg');
  if (!svg) return;
  const flat = state.papadMode === 'flat';
  const phase = prefersReducedMotion() ? 0 : ((now - microwave.t0) / 1000) * 2 * Math.PI * 0.6;
  const x0 = 20, x1 = 420, mid = 62, A = 38;
  const lambdaPx = 160; // 12 cm on this drawing
  const pts = [];
  for (let x = x0; x <= x1; x += 4) {
    const k = (2 * Math.PI) / lambdaPx;
    pts.push(`${x},${(mid - A * Math.sin(k * (x - x0)) * Math.cos(phase)).toFixed(1)}`);
  }
  const env = (sgn) => {
    const e = [];
    for (let x = x0; x <= x1; x += 6) e.push(`${x},${(mid - sgn * A * Math.abs(Math.sin((2 * Math.PI / lambdaPx) * (x - x0)))).toFixed(1)}`);
    return e.join(' ');
  };
  const nodes = [0, 1, 2, 3, 4, 5].map(i => x0 + i * lambdaPx / 2).filter(x => x <= x1);
  const heatStops = [];
  for (let i = 0; i <= 40; i++) {
    const x = 70 + (290 * i) / 40;
    const s = Math.sin((2 * Math.PI / lambdaPx) * (x - x0)) ** 2;
    // Thermal colour ramp: cold blue -> warm amber -> hot red
    const ramp = s < 0.5 ? [[59, 130, 246], [251, 191, 36], s * 2] : [[251, 191, 36], [220, 38, 38], (s - 0.5) * 2];
    const mix = ramp[0].map((c, k) => Math.round(c + (ramp[1][k] - c) * ramp[2]));
    const col = `rgb(${mix.join(',')})`;
    heatStops.push(`<stop offset="${(i / 40).toFixed(3)}" stop-color="${col}" />`);
  }
  const rot = prefersReducedMotion() ? 0 : ((now - microwave.t0) / 1000) * 40;
  svg.innerHTML = `
    <defs><linearGradient id="mw-heat" x1="0" x2="1">${heatStops.join('')}</linearGradient></defs>
    <line x1="${x0}" y1="${mid}" x2="${x1}" y2="${mid}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4 4" />
    <polyline points="${env(1)}" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".25" />
    <polyline points="${env(-1)}" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".25" />
    <polyline points="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" />
    ${nodes.map(x => `<circle cx="${x}" cy="${mid}" r="4.5" fill="var(--text-main)" />`).join('')}
    <text x="${x0 + lambdaPx / 2}" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="var(--accent)">λ = 12 cm (2.45 GHz)</text>
    <path d="M ${x0} 22 L ${x0 + lambdaPx} 22" stroke="var(--accent)" stroke-width="1" marker-start="url(#none)" />
    <line x1="${x0}" y1="18" x2="${x0}" y2="26" stroke="var(--accent)" /><line x1="${x0 + lambdaPx}" y1="18" x2="${x0 + lambdaPx}" y2="26" stroke="var(--accent)" />
    ${flat ? `
      ${nodes.filter(x => x > 70 && x < 360).map(x => `<line x1="${x}" y1="${mid + 6}" x2="${x}" y2="136" stroke="var(--text-muted)" stroke-dasharray="3 3" />`).join('')}
      <ellipse cx="215" cy="152" rx="145" ry="22" fill="url(#mw-heat)" stroke="#b45309" stroke-width="2" />
      ${nodes.filter(x => x > 70 && x < 360).map(x => `<text x="${x}" y="156" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">COLD</text>`).join('')}
      <text x="215" y="196" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--text-main)">Heating ∝ E² = sin²(2πx/λ): cold stripes every 6 cm</text>
    ` : `
      <g transform="translate(220,140)">
        <ellipse cx="0" cy="34" rx="62" ry="10" fill="none" stroke="var(--accent-3)" stroke-width="2" stroke-dasharray="6 5" transform="rotate(0)" style="transform-origin:center" />
        <rect x="-40" y="-60" width="80" height="94" rx="8" fill="rgba(56,189,248,0.14)" stroke="#0284c7" stroke-width="2" />
        <g transform="scale(${Math.cos(rot * Math.PI / 180).toFixed(3)},1)"><rect x="-30" y="-52" width="60" height="78" rx="28" fill="url(#mw-heat)" stroke="#b45309" stroke-width="2" /></g>
        <rect x="-30" y="-52" width="60" height="78" rx="28" fill="#fbbf24" opacity=".55" />
      </g>
      <text x="215" y="196" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--accent-3)">Rolled + turntable: every point sweeps through the hot peaks</text>
    `}`;
}

function startMicrowave() {
  if (microwave.raf) return;
  if (prefersReducedMotion()) { drawMicrowaveFrame(performance.now()); return; }
  const loop = (now) => { drawMicrowaveFrame(now); microwave.raf = requestAnimationFrame(loop); };
  microwave.raf = requestAnimationFrame(loop);
}
function stopMicrowave() { if (microwave.raf) cancelAnimationFrame(microwave.raf); microwave.raf = null; }

/* ---------------------------------------------------------------------
   8. CH8 · BIRYANI GANTT (SVG swim-lanes)
--------------------------------------------------------------------- */
function renderBiryaniGanttSvg() {
  const svg = document.getElementById('biryani-gantt-svg');
  if (!svg) return;
  const lanes = [...new Set(BIRYANI_TRACKS.map(t => t.track))];
  const L = 118, R = 990, top = 26, laneH = 34;
  const sx = (pct) => L + (pct / 100) * (R - L);
  const H = top + lanes.length * laneH + 8;
  svg.setAttribute('viewBox', `0 0 1000 ${H}`);
  const grid = [0, 25, 50, 75, 100].map(p => `
    <line x1="${sx(p)}" y1="${top - 6}" x2="${sx(p)}" y2="${H - 6}" stroke="var(--border-subtle)" />
    <text x="${sx(p)}" y="${top - 12}" text-anchor="middle" font-size="10.5" font-family="JetBrains Mono, monospace" fill="var(--text-muted)">${p === 0 ? 'START' : p === 100 ? 'SERVE' : p + '%'}</text>`).join('');
  const laneBg = lanes.map((ln, i) => `
    <rect x="0" y="${top + i * laneH}" width="1000" height="${laneH}" fill="${i % 2 ? 'transparent' : 'var(--surface-subtle)'}" />
    <text x="8" y="${top + i * laneH + laneH / 2 + 4}" font-size="11.5" font-weight="700" fill="var(--text-main)">${ln}</text>`).join('');
  const bars = BIRYANI_TRACKS.map(t => {
    const i = lanes.indexOf(t.track);
    const done = state.biryaniChecked.has(t.id);
    const x = sx(t.start), w = Math.max(10, sx(t.start + t.span) - x);
    return `<g class="gantt-bar" data-biryani-toggle="${t.id}" role="button" tabindex="0" aria-pressed="${done}" aria-label="${escapeHTML(t.task)}" style="cursor:pointer">
      <title>${escapeHTML(t.task)}</title>
      <rect x="${x}" y="${top + i * laneH + 6}" width="${w}" height="${laneH - 12}" rx="6" fill="${t.color}" opacity="${done ? 0.3 : 0.92}" />
      ${done ? `<text x="${x + w / 2}" y="${top + i * laneH + laneH / 2 + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="${t.color}">✓</text>` : ''}
    </g>`;
  }).join('');
  svg.innerHTML = laneBg + grid + bars;
}

/* ---------------------------------------------------------------------
   9. CH2 · CAPSAICIN CALLOUT
--------------------------------------------------------------------- */
function renderCapsaicin() {
  drawMolecule(document.getElementById('capsaicin-canvas'), 'Capsaicin', { width: 240, height: 120, padding: 6 });
}

/* Re-draw every theme-sensitive canvas viz */
function refreshScienceViz() {
  renderThermoBand(Number(document.getElementById('thermal-slider').value));
  drawKineticsFrame(0);
  renderBoilingLab();
  renderUmamiModel();
  renderMaillardStructures();
  renderCapsaicin();
  if (typeof renderMoleculeViewer === 'function') renderMoleculeViewer();
}
