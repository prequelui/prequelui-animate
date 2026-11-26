import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "coins",
  "name": "Coins",
  "group": "Finance",
  "theme": "green",
  "keywords": [
    "coins",
    "savings",
    "money",
    "stack"
  ],
  "description": "A stack of coins built from three ridges, with an orb and a comet behind.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M322 370A190 62 0 1 0 702 370A190 62 0 1 0 322 370Z",
      "width": 23
    },
    {
      "d": "M322 370V560",
      "width": 22
    },
    {
      "d": "M702 370V560",
      "width": 22
    },
    {
      "d": "M322 560A190 62 0 0 0 702 560",
      "width": 23
    },
    {
      "d": "M322 430A190 62 0 0 0 702 430",
      "width": 20
    },
    {
      "d": "M322 496A190 62 0 0 0 702 496",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-14 -99.02A100 100 0 1 0 -14 99.02Z",
      "transform": "translate(752 420) rotate(0)"
    },
    {
      "d": "M14 -99.02A100 100 0 0 1 14 99.02Z",
      "transform": "translate(752 420) rotate(0)"
    },
    {
      "d": "M110 0C60.5 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 60.5 17 110 0Z",
      "transform": "translate(286 300) rotate(146)"
    }
  ],
  "palette": {
    "light": [
      "#38d4b0",
      "#5b6cff"
    ],
    "dark": [
      "#6fe6c8",
      "#7c8bff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "scale": 1.08
    }
  }
};

export const meta = {
  "slug": "coins",
  "name": "Coins",
  "group": "Finance",
  "motion": "pulse",
  "component": "PrequelCoinsPictogram"
};

export function createPrequelCoinsPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
