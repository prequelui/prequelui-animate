import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "sunny",
  "name": "Sunny",
  "group": "Weather",
  "theme": "sky",
  "keywords": [
    "sun",
    "weather",
    "light",
    "day"
  ],
  "description": "A sun disc with eight rounded rays, next to a split orb and a comet.",
  "motion": "spin",
  "ink": [
    {
      "d": "M374 512A138 138 0 1 0 650 512A138 138 0 1 0 374 512Z",
      "width": 23
    },
    {
      "d": "M708 512L780 512",
      "width": 23
    },
    {
      "d": "M650.59 650.59L701.5 701.5",
      "width": 23
    },
    {
      "d": "M512 708L512 780",
      "width": 23
    },
    {
      "d": "M373.41 650.59L322.5 701.5",
      "width": 23
    },
    {
      "d": "M316 512L244 512",
      "width": 23
    },
    {
      "d": "M373.41 373.41L322.5 322.5",
      "width": 23
    },
    {
      "d": "M512 316L512 244",
      "width": 23
    },
    {
      "d": "M650.59 373.41L701.5 322.5",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-13 -87.03A88 88 0 1 0 -13 87.03Z",
      "transform": "translate(760 300) rotate(0)"
    },
    {
      "d": "M13 -87.03A88 88 0 0 1 13 87.03Z",
      "transform": "translate(760 300) rotate(0)"
    },
    {
      "d": "M100 0C55 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 55 15 100 0Z",
      "transform": "translate(280 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#58c8ff",
      "#8a6cff"
    ],
    "dark": [
      "#7cd6ff",
      "#a48cff"
    ]
  },
  "motionConfig": {
    "main": {
      "rotate": 10
    },
    "accent": {
      "x": 10
    }
  }
};

export const meta = {
  "slug": "sunny",
  "name": "Sunny",
  "group": "Weather",
  "motion": "spin",
  "component": "PrequelSunnyPictogram"
};

export function createPrequelSunnyPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
