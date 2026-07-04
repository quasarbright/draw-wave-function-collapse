import { test } from "node:test";
import assert from "node:assert/strict";
import { extractPatterns, generate } from "./wfc.js";
import { presets } from "./presets.js";

const islandSeed = [
  ["G", "G", "G", "W", "W", "G", "G", "G"],
  ["G", "G", "W", "W", "W", "W", "G", "G"],
  ["G", "T", "G", "G", "G", "G", "T", "G"],
  ["G", "G", "G", "P", "P", "G", "G", "G"],
  ["G", "G", "G", "P", "P", "G", "G", "G"],
  ["G", "T", "G", "G", "G", "G", "T", "G"],
  ["G", "G", "W", "W", "W", "W", "G", "G"],
  ["G", "G", "G", "W", "W", "G", "G", "G"],
];

test("generate succeeds reliably with the app's actual settings (no wraparound while learning, non-tileable output)", () => {
  // Mirrors app.js's effectiveN clamp: a seed this small only has 4 non-periodic 3x3
  // samples to learn from, which is too little for a 3x3 pattern window to stay reliable.
  for (const [key, preset] of Object.entries(presets)) {
    const N = preset.grid.length <= 4 ? 2 : 3;
    let failures = 0;
    for (let i = 0; i < 20; i++) {
      const out = generate(preset.grid, {
        N,
        outW: 32,
        outH: 32,
        symmetry: false,
        periodicInput: false,
        periodicOutput: false,
        attempts: 100,
      });
      if (!out) failures++;
    }
    assert.equal(failures, 0, `preset "${key}" should generate reliably with no input wraparound`);
  }
});

test("a seed too small for the default pattern size falls back reliably (regression: 4x4 canvas + 3x3 pattern)", () => {
  const seed = presets.gem.grid; // 4x4
  let failuresAtN3 = 0, failuresAtN2 = 0;
  for (let i = 0; i < 15; i++) {
    if (!generate(seed, { N: 3, outW: 32, outH: 32, symmetry: false, periodicInput: false, periodicOutput: false, attempts: 100 })) failuresAtN3++;
    if (!generate(seed, { N: 2, outW: 32, outH: 32, symmetry: false, periodicInput: false, periodicOutput: false, attempts: 100 })) failuresAtN2++;
  }
  assert.ok(failuresAtN3 > 0, "documents why app.js clamps N to 2 for 4x4 canvases");
  assert.equal(failuresAtN2, 0, "N=2 should be reliable for a 4x4 seed");
});

test("generated output only reuses colors present in the seed", () => {
  const seed = presets.islands.grid;
  const out = generate(seed, { N: 3, outW: 32, outH: 32, symmetry: true, periodicInput: false, periodicOutput: false, attempts: 100 });
  assert.ok(out, "expected a successful generation");
  const seedColors = new Set(seed.flat());
  for (const row of out) {
    for (const cell of row) assert.ok(seedColors.has(cell), `unexpected color ${cell} not present in seed`);
  }
});

test("a tileable (periodicOutput) result needs periodic learning — documents why the app dropped that option", () => {
  // Without wraparound while reading the seed, some learned tiles have no valid neighbor
  // in some direction (nothing "beyond the edge" of a finite, non-wrapping source). Those
  // get banned from any interior cell. A non-tileable output can route around them by
  // parking them at its boundary; a tileable (toroidal) output has no boundary to park them
  // at, so it becomes unreliable regardless of size. This is a structural limitation, not a
  // bug — the app only exposes non-tileable output as a result.
  let failures = 0;
  for (let i = 0; i < 15; i++) {
    if (!generate(islandSeed, { N: 3, outW: 16, outH: 16, symmetry: false, periodicInput: false, periodicOutput: true, attempts: 100 })) failures++;
  }
  assert.ok(failures > 0, "expected periodicOutput to be unreliable without periodic learning");
});

test("output preserves the seed's vertical adjacency order (regression: agrees() previously flipped it)", () => {
  // Strict cyclic order: A is always directly above B, B always directly above C, C
  // always directly above A — never the reverse. This caught a real bug where the
  // overlap-agreement check had p1/p2 swapped relative to (dx, dy), silently inverting
  // every adjacency (including up/down) that the algorithm learned from the seed.
  const A = "A", B = "B", C = "C";
  const seed = [];
  for (let y = 0; y < 12; y++) seed.push(new Array(8).fill([A, B, C][y % 3]));
  const nextExpected = { [A]: B, [B]: C, [C]: A };
  let correct = 0, flipped = 0;
  for (let trial = 0; trial < 10; trial++) {
    const out = generate(seed, { N: 3, outW: 24, outH: 24, symmetry: false, periodicInput: false, periodicOutput: false, attempts: 100 });
    if (!out) continue;
    for (let y = 0; y < out.length - 1; y++) {
      for (let x = 0; x < out[0].length; x++) {
        const top = out[y][x], bot = out[y + 1][x];
        if (top === bot) continue;
        if (nextExpected[top] === bot) correct++; else flipped++;
      }
    }
  }
  assert.ok(correct > 0, "expected to observe the learned adjacency at least once");
  assert.equal(flipped, 0, "no adjacency should ever appear in the reverse (flipped) order");
});

test("extractPatterns finds a reasonable number of unique patterns without wraparound", () => {
  const model = extractPatterns(islandSeed, 3, { periodicInput: false, symmetry: false });
  assert.ok(model.patterns.length > 5 && model.patterns.length < 64);
  assert.equal(model.weights.reduce((a, b) => a + b, 0), 36); // 8x8, N=3, non-periodic -> 6x6 samples
});
