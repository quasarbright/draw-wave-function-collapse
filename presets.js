/* presets.js — small seed patterns to load for inspiration.
 * Each preset is a 2D array of hex color strings. Keep them small (<=16 wide) and
 * roughly seamless at the edges since generation treats the seed as tileable. */

const G = "#3a6b4a"; // grass
const g = "#4f8a5f"; // grass hi
const W = "#3f6fae"; // water
const w = "#5a8fd6"; // water hi
const S = "#cfb27a"; // sand
const T = "#2b4a2f"; // tree
const R = "#6b5b4a"; // rock/path
const D = "#4a3826"; // dirt
const SKY = "#8fd0e0"; // sky
const FL = "#e8c93f"; // flower petal
const ST = "#3f8f52"; // stem
const SO = "#8a5a3a"; // soil

export const presets = {
  islands: {
    label: "Islands",
    grid: [
      [G, G, G, S, W, W, S, G, G, G, G, S, W, W, S, G],
      [G, T, G, S, W, w, S, G, G, T, G, S, W, w, S, G],
      [G, G, S, W, w, w, W, S, G, G, S, W, w, w, W, S],
      [S, S, W, w, w, w, w, W, S, S, W, w, w, w, w, W],
      [W, W, w, w, W, w, w, w, W, W, w, w, W, w, w, w],
      [S, S, W, w, w, w, w, W, S, S, W, w, w, w, w, W],
      [G, G, S, W, w, w, W, S, G, G, S, W, w, w, W, S],
      [G, T, G, S, W, w, S, G, G, T, G, S, W, w, S, G],
      [G, G, G, S, W, W, S, G, G, G, G, S, W, W, S, G],
      [G, G, T, G, G, G, G, T, G, G, G, T, G, G, G, T],
      [G, T, G, S, W, W, S, G, G, T, G, S, W, W, S, G],
      [G, G, S, W, w, w, W, S, G, G, S, W, w, w, W, S],
      [S, S, W, w, w, w, w, W, S, S, W, w, w, w, w, W],
      [W, W, w, w, W, w, w, w, W, W, w, w, W, w, w, w],
      [S, S, W, w, w, w, w, W, S, S, W, w, w, w, w, W],
      [G, G, S, W, w, w, W, S, G, G, S, W, w, w, W, S],
    ],
  },
  village: {
    label: "Village paths",
    grid: [
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [G, T, G, G, R, G, G, T, G, G, T, R, G, G],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [G, G, D, D, R, D, D, G, G, D, D, R, D, D],
      [G, T, D, D, R, D, D, T, G, D, D, R, D, D],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [G, T, G, G, R, G, G, T, G, G, T, R, G, G],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [G, G, G, G, R, G, G, G, G, G, G, R, G, G],
      [G, G, D, D, R, D, D, G, G, D, D, R, D, D],
    ],
  },
  forest: {
    label: "Forest",
    grid: [
      [G, G, T, G, G, G, T, G, G, G, T, G],
      [G, T, T, T, G, T, T, T, G, T, T, T],
      [G, G, T, G, G, G, T, G, G, G, T, G],
      [G, G, G, G, G, G, G, G, G, G, G, G],
      [T, G, G, T, G, G, T, G, G, T, G, G],
      [T, T, G, T, T, G, T, T, G, T, T, G],
      [T, G, G, T, G, G, T, G, G, T, G, G],
      [G, G, G, G, G, G, G, G, G, G, G, G],
      [G, G, T, G, G, G, T, G, G, G, T, G],
      [G, T, T, T, G, T, T, T, G, T, T, T],
      [G, G, T, G, G, G, T, G, G, G, T, G],
      [G, G, G, G, G, G, G, G, G, G, G, G],
    ],
  },
  flowers: {
    label: "Flowers",
    grid: [
      [SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY],
      [SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY],
      [SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY],
      [SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY],
      [SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY, SKY],
      [SKY, FL, SKY, FL, SKY, SKY, FL, SKY, FL, SKY, SKY, FL, SKY, FL, SKY],
      [SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY],
      [SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY],
      [SKY, FL, SKY, FL, SKY, SKY, FL, SKY, FL, SKY, SKY, FL, SKY, FL, SKY],
      [SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY, SKY, ST, SKY, ST, SKY],
      [SKY, SKY, ST, SKY, SKY, SKY, SKY, ST, SKY, SKY, SKY, SKY, ST, SKY, SKY],
      [SKY, SKY, ST, SKY, SKY, SKY, SKY, ST, SKY, SKY, SKY, SKY, ST, SKY, SKY],
      [SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO],
      [SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO, SO],
    ],
  },
  checker: {
    label: "Checkerboard",
    grid: [
      [G, G, R, R, G, G, R, R],
      [G, G, R, R, G, G, R, R],
      [R, R, G, G, R, R, G, G],
      [R, R, G, G, R, R, G, G],
      [G, G, R, R, G, G, R, R],
      [G, G, R, R, G, G, R, R],
      [R, R, G, G, R, R, G, G],
      [R, R, G, G, R, R, G, G],
    ],
  },
  link: {
    label: "Link",
    grid: (() => {
      const a = "#1c1b26", b = "#e8dfc8";
      const rows = [
        "aaaaaaaaaaaa",
        "abbbbaaaaaaa",
        "abaabaaaaaaa",
        "abaaaaaaaaaa",
        "abbbbbbbaaaa",
        "aaaaaaabaaaa",
        "aaaabaabaaaa",
        "aaaabbbbaaaa",
        "aaaaaaaaaaaa",
        "aaaaaaaaaaaa",
        "aaaaaaaaaaaa",
        "aaaaaaaaaaaa",
      ];
      return rows.map((row) => [...row].map((c) => (c === "a" ? a : b)));
    })(),
  },
  gem: {
    label: "Gem",
    grid: (() => {
      const a = "#1c1b26", b = "#e8dfc8", c = "#c94f4f";
      const rows = ["aaaa", "bbba", "bcba", "bbba"];
      const map = { a, b, c };
      return rows.map((row) => [...row].map((ch) => map[ch]));
    })(),
  },
};

export const defaultPalette = [
  "#1c1b26", // near-black
  "#e8dfc8", // cream
  "#c94f4f", // red
  "#d98a3d", // orange
  "#dcc24a", // yellow
  G,          // grass green
  "#3f8f7a", // teal
  W,          // blue
  "#6b5fc7", // violet
  "#b25a9e", // magenta/pink
  T,          // dark green
  D,          // brown
  R,          // stone/gray
  S,          // sand
];
