import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "wallet",
  "name": "Wallet",
  "group": "Finance",
  "theme": "green",
  "keywords": [
    "wallet",
    "money",
    "cash",
    "pocket"
  ],
  "description": "A folded wallet with a card peeking out, a clasp ring and an orb at the left edge.",
  "motion": "orb",
  "ink": [
    {
      "d": "M320 300H584A20 20 0 0 1 604 320V380A20 20 0 0 1 584 400H320A20 20 0 0 1 300 380V320A20 20 0 0 1 320 300Z",
      "width": 23,
      "transform": "rotate(-4 452 350)"
    },
    {
      "d": "M254 368H770A40 40 0 0 1 810 408V648A40 40 0 0 1 770 688H254A40 40 0 0 1 214 648V408A40 40 0 0 1 254 368Z",
      "width": 23
    },
    {
      "d": "M718 528A46 46 0 1 0 810 528A46 46 0 1 0 718 528Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -106.95A108 108 0 1 0 -15 106.95Z",
      "transform": "translate(250 500) rotate(0)"
    },
    {
      "d": "M15 -106.95A108 108 0 0 1 15 106.95Z",
      "transform": "translate(250 500) rotate(0)"
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
      "x": 16,
      "y": -10
    }
  }
};

export const meta = {
  "slug": "wallet",
  "name": "Wallet",
  "group": "Finance",
  "motion": "orb",
  "component": "PrequelWalletPictogram"
};

export function createPrequelWalletPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
