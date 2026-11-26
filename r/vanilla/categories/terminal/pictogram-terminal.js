import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "terminal",
  "name": "Terminal",
  "group": "Development",
  "theme": "teal",
  "keywords": [
    "terminal",
    "shell",
    "command",
    "console"
  ],
  "description": "A console window with three dots, a prompt and a split orb on the right.",
  "motion": "orb",
  "ink": [
    {
      "d": "M230 260H794A40 40 0 0 1 834 300V724A40 40 0 0 1 794 764H230A40 40 0 0 1 190 724V300A40 40 0 0 1 230 260Z",
      "width": 23
    },
    {
      "d": "M190 356H834",
      "width": 22
    },
    {
      "d": "M229 308A15 15 0 1 0 259 308A15 15 0 1 0 229 308Z",
      "fill": true
    },
    {
      "d": "M279 308A15 15 0 1 0 309 308A15 15 0 1 0 279 308Z",
      "fill": true
    },
    {
      "d": "M329 308A15 15 0 1 0 359 308A15 15 0 1 0 329 308Z",
      "fill": true
    },
    {
      "d": "M300 456L382 512L300 568",
      "width": 23
    },
    {
      "d": "M430 568H566",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-15 -108.97A110 110 0 1 0 -15 108.97Z",
      "transform": "translate(740 540) rotate(0)"
    },
    {
      "d": "M15 -108.97A110 110 0 0 1 15 108.97Z",
      "transform": "translate(740 540) rotate(0)"
    },
    {
      "d": "M100 0C55 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 55 15 100 0Z",
      "transform": "translate(300 400) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#2fd3c0",
      "#46a4ff"
    ],
    "dark": [
      "#5fe6d4",
      "#6cbaff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 16,
      "y": -10
    }
  }
};

export const meta = {
  "slug": "terminal",
  "name": "Terminal",
  "group": "Development",
  "motion": "orb",
  "component": "PrequelTerminalPictogram"
};

export function createPrequelTerminalPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
