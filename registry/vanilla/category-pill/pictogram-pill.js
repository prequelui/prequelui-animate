import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "pill",
  "name": "Pill",
  "group": "Health",
  "theme": "red",
  "keywords": [
    "pill",
    "medicine",
    "capsule",
    "pharmacy"
  ],
  "description": "A tilted capsule split by a seam, with a split orb behind its lower half.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M384 250H640A128 128 0 0 1 640 506H384A128 128 0 0 0 384 250Z",
      "width": 23,
      "transform": "rotate(-38 512 512)"
    },
    {
      "d": "M384 378H640",
      "width": 22,
      "transform": "rotate(-38 512 512)"
    }
  ],
  "accent": [
    {
      "d": "M-14 -99.02A100 100 0 1 0 -14 99.02Z",
      "transform": "translate(238 352) rotate(0)"
    },
    {
      "d": "M14 -99.02A100 100 0 0 1 14 99.02Z",
      "transform": "translate(238 352) rotate(0)"
    },
    {
      "d": "M118 0C64.9 -20 20 -20 0 -20A20 20 0 0 0 0 20C20 20 64.9 20 118 0Z",
      "transform": "translate(722 296) rotate(-22)"
    }
  ],
  "palette": {
    "light": [
      "#ff6a6a",
      "#ff9a5c"
    ],
    "dark": [
      "#ff8a8a",
      "#ffb07c"
    ]
  },
  "motionConfig": {
    "main": {
      "rotate": -2.4
    },
    "accent": {
      "x": 12,
      "y": -6
    }
  }
};

export const meta = {
  "slug": "pill",
  "name": "Pill",
  "group": "Health",
  "motion": "tilt",
  "component": "PrequelPillPictogram"
};

export function createPrequelPillPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
