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
};

export const defaultPalette = [G, g, W, w, S, T, R, D, "#e8dfc8", "#1c1b26"];
