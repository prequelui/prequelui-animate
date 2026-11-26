import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "hair-dryer",
  "name": "Hair dryer",
  "group": "Beauty",
  "theme": "rose",
  "keywords": [
    "dryer",
    "hair",
    "salon",
    "beauty",
    "blow"
  ],
  "description": "A rounded dryer with a short nozzle and a loop handle, blowing three comets of warm air.",
  "motion": "spray",
  "ink": [
    {
      "d": "M382 426H550A96 96 0 0 1 646 522V566A96 96 0 0 1 550 662H382A96 96 0 0 1 286 566V522A96 96 0 0 1 382 426Z",
      "width": 23
    },
    {
      "d": "M646 490H780V598H646Z",
      "width": 23
    },
    {
      "d": "M404 662V790H536V662",
      "width": 23
    },
    {
      "d": "M352 508A20 20 0 1 0 392 508A20 20 0 1 0 352 508Z",
      "fill": true
    },
    {
      "d": "M352 566A20 20 0 1 0 392 566A20 20 0 1 0 352 566Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-14 -92.95A94 94 0 1 0 -14 92.95Z",
      "transform": "translate(276 566) rotate(20)"
    },
    {
      "d": "M14 -92.95A94 94 0 0 1 14 92.95Z",
      "transform": "translate(276 566) rotate(20)"
    },
    {
      "d": "M90 0C49.5 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 49.5 13 90 0Z",
      "transform": "translate(800 498) rotate(0)"
    },
    {
      "d": "M120 0C66 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 66 15 120 0Z",
      "transform": "translate(804 548) rotate(0)"
    },
    {
      "d": "M80 0C44 -12 12 -12 0 -12A12 12 0 0 0 0 12C12 12 44 12 80 0Z",
      "transform": "translate(800 598) rotate(0)"
    }
  ],
  "palette": {
    "light": [
      "#ff7ca8",
      "#ff9a5c"
    ],
    "dark": [
      "#ff9ac0",
      "#ffb07c"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 18,
      "y": -14,
      "scale": 1.06
    }
  }
};

export const meta = {
  "slug": "hair-dryer",
  "name": "Hair dryer",
  "group": "Beauty",
  "motion": "spray",
  "component": "PrequelHairDryerPictogram"
};

export function createPrequelHairDryerPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
