import { generate } from "./wfc.js";
import { presets, defaultPalette } from "./presets.js";

const EMPTY_COLOR = "#241f30"; // eraser color — just another paintable tile

/* ---------------- state ---------------- */
let seedSize = 12;
let seedGrid = makeGrid(seedSize, defaultPalette[0]);
let activeColor = defaultPalette[0];
let outSize = 48;
let patternN = 3;
let symmetry = true;
let tileable = true;

function makeGrid(size, fill) {
  return Array.from({ length: size }, () => new Array(size).fill(fill));
}

/* ---------------- DOM ---------------- */
const seedCanvas = document.getElementById("seedCanvas");
const seedCtx = seedCanvas.getContext("2d");
const worldFrame = document.getElementById("worldFrame");
const paletteEl = document.getElementById("palette");
const presetRow = document.getElementById("presetRow");
const seedSizeSel = document.getElementById("seedSizeSel");
const outSizeSel = document.getElementById("outSizeSel");
const patternSel = document.getElementById("patternSel");
const symmetryChk = document.getElementById("symmetryChk");
const tileableChk = document.getElementById("tileableChk");
const weaveBtn = document.getElementById("weaveBtn");
const statusEl = document.getElementById("weaveStatus");
const downloadBtn = document.getElementById("downloadBtn");

/* ---------------- seed canvas rendering + painting ---------------- */
const SEED_DISPLAY = 340;

function cellSizeFor(size) {
  return Math.floor(SEED_DISPLAY / size);
}

function drawSeed() {
  const cs = cellSizeFor(seedSize);
  seedCanvas.width = cs * seedSize;
  seedCanvas.height = cs * seedSize;
  for (let y = 0; y < seedSize; y++) {
    for (let x = 0; x < seedSize; x++) {
      seedCtx.fillStyle = seedGrid[y][x];
      seedCtx.fillRect(x * cs, y * cs, cs, cs);
    }
  }
  seedCtx.strokeStyle = "rgba(0,0,0,.25)";
  seedCtx.lineWidth = 1;
  for (let i = 0; i <= seedSize; i++) {
    seedCtx.beginPath(); seedCtx.moveTo(i * cs + .5, 0); seedCtx.lineTo(i * cs + .5, cs * seedSize); seedCtx.stroke();
    seedCtx.beginPath(); seedCtx.moveTo(0, i * cs + .5); seedCtx.lineTo(cs * seedSize, i * cs + .5); seedCtx.stroke();
  }
}

function paintAt(clientX, clientY) {
  const rect = seedCanvas.getBoundingClientRect();
  const scale = seedCanvas.width / rect.width;
  const x = Math.floor((clientX - rect.left) * scale / cellSizeFor(seedSize));
  const y = Math.floor((clientY - rect.top) * scale / cellSizeFor(seedSize));
  if (x < 0 || y < 0 || x >= seedSize || y >= seedSize) return;
  if (seedGrid[y][x] === activeColor) return;
  seedGrid[y][x] = activeColor;
  drawSeed();
}

let painting = false;
seedCanvas.addEventListener("pointerdown", (e) => { painting = true; paintAt(e.clientX, e.clientY); });
window.addEventListener("pointerup", () => { painting = false; });
seedCanvas.addEventListener("pointermove", (e) => { if (painting) paintAt(e.clientX, e.clientY); });
seedCanvas.addEventListener("contextmenu", (e) => e.preventDefault());

/* ---------------- palette ---------------- */
function renderPalette() {
  paletteEl.innerHTML = "";
  for (const color of defaultPalette) {
    const b = document.createElement("button");
    b.className = "swatch" + (color === activeColor ? " is-active" : "");
    b.style.background = color;
    b.title = color;
    b.addEventListener("click", () => { activeColor = color; renderPalette(); });
    paletteEl.appendChild(b);
  }
  const eraser = document.createElement("button");
  eraser.className = "swatch eraser" + (activeColor === EMPTY_COLOR ? " is-active" : "");
  eraser.title = "Eraser";
  eraser.addEventListener("click", () => { activeColor = EMPTY_COLOR; renderPalette(); });
  paletteEl.appendChild(eraser);

  const custom = document.createElement("input");
  custom.type = "color";
  custom.className = "swatch-custom";
  custom.title = "Custom color";
  custom.addEventListener("input", () => { activeColor = custom.value; renderPalette(); });
  paletteEl.appendChild(custom);
}

/* ---------------- presets ---------------- */
function renderPresets() {
  presetRow.innerHTML = "";
  for (const [key, preset] of Object.entries(presets)) {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = preset.label;
    b.addEventListener("click", () => loadPreset(preset));
    presetRow.appendChild(b);
  }
}

function loadPreset(preset) {
  seedSize = preset.grid.length;
  seedGrid = preset.grid.map((row) => row.slice());
  if (![...seedSizeSel.options].some((o) => Number(o.value) === seedSize)) {
    const opt = document.createElement("option");
    opt.value = seedSize; opt.textContent = `${seedSize}×${seedSize}`;
    seedSizeSel.appendChild(opt);
  }
  seedSizeSel.value = seedSize;
  drawSeed();
}

/* ---------------- size / option controls ---------------- */
seedSizeSel.addEventListener("change", () => {
  const newSize = Number(seedSizeSel.value);
  const fresh = makeGrid(newSize, defaultPalette[0]);
  for (let y = 0; y < Math.min(newSize, seedSize); y++) {
    for (let x = 0; x < Math.min(newSize, seedSize); x++) fresh[y][x] = seedGrid[y][x];
  }
  seedSize = newSize;
  seedGrid = fresh;
  drawSeed();
});
outSizeSel.addEventListener("change", () => { outSize = Number(outSizeSel.value); });
patternSel.addEventListener("change", () => { patternN = Number(patternSel.value); });
symmetryChk.addEventListener("change", () => { symmetry = symmetryChk.checked; });
tileableChk.addEventListener("change", () => { tileable = tileableChk.checked; });

/* ---------------- weave ---------------- */
let lastWorldCanvas = null;

function renderWorld(grid) {
  const size = grid.length;
  const cs = Math.max(2, Math.floor(560 / size));
  const cvs = document.createElement("canvas");
  cvs.id = "worldCanvas";
  cvs.width = cs * grid[0].length;
  cvs.height = cs * size;
  const ctx = cvs.getContext("2d");
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      ctx.fillStyle = grid[y][x] || "#000";
      ctx.fillRect(x * cs, y * cs, cs, cs);
    }
  }
  worldFrame.innerHTML = "";
  worldFrame.appendChild(cvs);
  lastWorldCanvas = cvs;
  downloadBtn.disabled = false;
}

weaveBtn.addEventListener("click", async () => {
  weaveBtn.disabled = true;
  statusEl.textContent = "weaving…";
  statusEl.classList.remove("is-error");
  await new Promise((r) => setTimeout(r, 20)); // let the status paint before the sync compute
  try {
    const out = generate(seedGrid, {
      N: patternN,
      outW: outSize,
      outH: outSize,
      symmetry,
      periodicInput: true,
      periodicOutput: tileable,
      attempts: 30,
    });
    if (!out) {
      statusEl.textContent = "Couldn't weave a consistent world from this seed — try a smaller pattern size, enabling symmetries, or a busier seed.";
      statusEl.classList.add("is-error");
    } else {
      statusEl.textContent = `wove a ${outSize}×${outSize} world from a ${seedSize}×${seedSize} seed`;
      renderWorld(out);
    }
  } finally {
    weaveBtn.disabled = false;
  }
});

downloadBtn.addEventListener("click", () => {
  if (!lastWorldCanvas) return;
  const a = document.createElement("a");
  a.download = "woven-world.png";
  a.href = lastWorldCanvas.toDataURL("image/png");
  a.click();
});

/* ---------------- hero signature ---------------- */
function renderSignature() {
  const el = document.getElementById("loomSignature");
  const sample = presets.islands.grid[4]; // a representative row
  el.innerHTML = "";
  const n = 28;
  for (let i = 0; i < n; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.background = sample[i % sample.length];
    cell.style.opacity = String(Math.max(0.08, 1 - i / n));
    el.appendChild(cell);
  }
}

/* ---------------- init ---------------- */
renderPalette();
renderPresets();
renderSignature();
loadPreset(presets.islands);
