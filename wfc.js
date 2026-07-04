/* wfc.js — overlapping wave function collapse engine.
 * Pure data in/out: no DOM. `extractPatterns` learns NxN tiles (with optional
 * rotation/reflection symmetries) from a small seed grid; `run` grows a larger
 * grid whose every NxN neighborhood matches one of those tiles. */

const DX = [-1, 0, 1, 0];
const DY = [0, -1, 0, 1];
const OPP = [2, 3, 0, 1];

export function extractPatterns(inputGrid, N, { periodicInput = true, symmetry = true } = {}) {
  const H = inputGrid.length, W = inputGrid[0].length;

  function patternFromGrid(x0, y0) {
    const p = new Array(N * N);
    for (let dy = 0; dy < N; dy++) {
      for (let dx = 0; dx < N; dx++) {
        const xx = periodicInput ? (x0 + dx) % W : x0 + dx;
        const yy = periodicInput ? (y0 + dy) % H : y0 + dy;
        p[dx + dy * N] = inputGrid[yy][xx];
      }
    }
    return p;
  }
  const rotate = (p) => {
    const q = new Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) q[x + y * N] = p[(N - 1 - y) + x * N];
    return q;
  };
  const reflect = (p) => {
    const q = new Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) q[x + y * N] = p[(N - 1 - x) + y * N];
    return q;
  };

  const byKey = new Map(); // key -> index
  const patterns = [];
  const weights = [];
  function addPattern(p) {
    const key = p.join(",");
    if (byKey.has(key)) { weights[byKey.get(key)]++; return; }
    byKey.set(key, patterns.length);
    patterns.push(p);
    weights.push(1);
  }

  const xCount = periodicInput ? W : W - N + 1;
  const yCount = periodicInput ? H : H - N + 1;
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      let p = patternFromGrid(x, y);
      if (!symmetry) { addPattern(p); continue; }
      for (let k = 0; k < 4; k++) {
        addPattern(p);
        addPattern(reflect(p));
        p = rotate(p);
      }
    }
  }

  // True iff placing p2 at the cell offset (dx, dy) from p1 is consistent — i.e. the
  // two N×N windows agree on their overlapping pixels.
  function agrees(p1, p2, dx, dy) {
    const xmin = dx < 0 ? 0 : dx, xmax = dx < 0 ? dx + N : N;
    const ymin = dy < 0 ? 0 : dy, ymax = dy < 0 ? dy + N : N;
    for (let y = ymin; y < ymax; y++) {
      for (let x = xmin; x < xmax; x++) {
        if (p1[x + y * N] !== p2[(x - dx) + (y - dy) * N]) return false;
      }
    }
    return true;
  }

  const numPatterns = patterns.length;
  const propagator = [];
  for (let d = 0; d < 4; d++) {
    propagator[d] = [];
    for (let t1 = 0; t1 < numPatterns; t1++) {
      const list = [];
      for (let t2 = 0; t2 < numPatterns; t2++) {
        if (agrees(patterns[t1], patterns[t2], DX[d], DY[d])) list.push(t2);
      }
      propagator[d][t1] = list;
    }
  }

  return { patterns, weights, propagator, N };
}

// Returns a 2D array (outH x outW) of colors, or null if generation contradicted
// out (retry with a fresh rng seed / attempt).
export function run(model, outW, outH, { periodicOutput = true, rng = Math.random, maxAttemptSteps } = {}) {
  const { patterns, weights, propagator, N } = model;
  const numPatterns = patterns.length;
  const numCells = outW * outH;
  const maxSteps = maxAttemptSteps || numCells + 1;

  const wave = new Array(numCells);
  const compatible = new Array(numCells);
  const weightLogWeights = weights.map((w) => (w > 0 ? w * Math.log(w) : 0));
  const sumOfWeights = weights.reduce((a, b) => a + b, 0);
  const sumOfWeightLogWeights = weightLogWeights.reduce((a, b) => a + b, 0);
  const startingEntropy = Math.log(sumOfWeights) - sumOfWeightLogWeights / sumOfWeights;

  const sumsOfOnes = new Array(numCells).fill(numPatterns);
  const sumsOfWeights = new Array(numCells).fill(sumOfWeights);
  const sumsOfWeightLogWeights = new Array(numCells).fill(sumOfWeightLogWeights);
  const entropies = new Array(numCells).fill(startingEntropy);

  for (let i = 0; i < numCells; i++) {
    wave[i] = new Array(numPatterns).fill(true);
    compatible[i] = new Array(numPatterns);
    for (let t = 0; t < numPatterns; t++) {
      const c = [0, 0, 0, 0];
      for (let d = 0; d < 4; d++) c[d] = propagator[OPP[d]][t].length;
      compatible[i][t] = c;
    }
  }

  const stack = [];
  let contradiction = false;

  function ban(i, t) {
    wave[i][t] = false;
    const comp = compatible[i][t];
    comp[0] = comp[1] = comp[2] = comp[3] = 0;
    stack.push([i, t]);
    sumsOfOnes[i]--;
    sumsOfWeights[i] -= weights[t];
    sumsOfWeightLogWeights[i] -= weightLogWeights[t];
    const sw = sumsOfWeights[i];
    entropies[i] = sw > 0 ? Math.log(sw) - sumsOfWeightLogWeights[i] / sw : 0;
    if (sumsOfOnes[i] === 0) contradiction = true;
  }

  // A pattern with zero initial support in some direction can never legally sit at a
  // cell that actually has a neighbor in that direction (e.g. a pattern learned from
  // non-wrapping input that has nothing below it in the source). Ban those up front —
  // otherwise they'd linger as "possible" forever, since nothing ever decrements them
  // from zero, and picking one produces a seam the algorithm never notices.
  for (let i = 0; i < numCells; i++) {
    const x1 = i % outW, y1 = (i / outW) | 0;
    for (let t = 0; t < numPatterns; t++) {
      if (!wave[i][t]) continue;
      for (let d = 0; d < 4; d++) {
        const x2 = x1 + DX[d], y2 = y1 + DY[d];
        const hasNeighbor = periodicOutput || (x2 >= 0 && y2 >= 0 && x2 < outW && y2 < outH);
        if (hasNeighbor && compatible[i][t][d] === 0) { ban(i, t); break; }
      }
    }
  }

  function propagate() {
    while (stack.length && !contradiction) {
      const [i1, t1] = stack.pop();
      const x1 = i1 % outW, y1 = (i1 / outW) | 0;
      for (let d = 0; d < 4; d++) {
        let x2 = x1 + DX[d], y2 = y1 + DY[d];
        if (!periodicOutput && (x2 < 0 || y2 < 0 || x2 >= outW || y2 >= outH)) continue;
        if (x2 < 0) x2 += outW; else if (x2 >= outW) x2 -= outW;
        if (y2 < 0) y2 += outH; else if (y2 >= outH) y2 -= outH;
        const i2 = x2 + y2 * outW;
        const p = propagator[d][t1];
        for (let l = 0; l < p.length; l++) {
          const t2 = p[l];
          const comp = compatible[i2][t2];
          if (comp[d] === 0) continue; // already banned
          comp[d]--;
          if (comp[d] === 0 && wave[i2][t2]) ban(i2, t2);
        }
      }
    }
  }

  propagate(); // cascade the initial bans above
  if (contradiction) return null;

  function nextCell() {
    let min = Infinity, argmin = -1;
    for (let i = 0; i < numCells; i++) {
      if (sumsOfOnes[i] === 1) continue;
      const e = entropies[i] + 1e-6 * rng();
      if (e < min) { min = e; argmin = i; }
    }
    return argmin;
  }

  for (let step = 0; step < maxSteps; step++) {
    const i = nextCell();
    if (i === -1) break; // fully collapsed
    const w = new Array(numPatterns);
    let sum = 0;
    for (let t = 0; t < numPatterns; t++) { w[t] = wave[i][t] ? weights[t] : 0; sum += w[t]; }
    let r = rng() * sum, chosen = -1;
    for (let t = 0; t < numPatterns; t++) {
      if (w[t] <= 0) continue;
      if (r < w[t]) { chosen = t; break; }
      r -= w[t];
    }
    if (chosen === -1) chosen = w.findIndex((x) => x > 0);
    for (let t = 0; t < numPatterns; t++) if (t !== chosen && wave[i][t]) ban(i, t);
    propagate();
    if (contradiction) return null;
  }
  if (contradiction) return null;

  const output = Array.from({ length: outH }, () => new Array(outW).fill(null));
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const i = x + y * outW;
      let chosen = -1;
      for (let t = 0; t < numPatterns; t++) if (wave[i][t]) { chosen = t; break; }
      output[y][x] = chosen === -1 ? null : patterns[chosen][0];
    }
  }
  return output;
}

export function generate(inputGrid, { N = 3, outW = 48, outH = 48, symmetry = true, periodicInput = true, periodicOutput = true, attempts = 20, rng = Math.random } = {}) {
  const model = extractPatterns(inputGrid, N, { periodicInput, symmetry });
  for (let a = 0; a < attempts; a++) {
    const out = run(model, outW, outH, { periodicOutput, rng });
    if (out) return out;
  }
  return null;
}
