import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "blocks",
  "name": "Building blocks",
  "group": "Kids",
  "theme": "candy",
  "keywords": [
    "blocks",
    "toys",
    "kids",
    "play",
    "build"
  ],
  "description": "Three toy blocks with a circle, a triangle and a cross, stacked in a little tower.",
  "motion": "float",
  "ink": [
    {
      "d": "M432 320H588A22 22 0 0 1 610 342V498A22 22 0 0 1 588 520H432A22 22 0 0 1 410 498V342A22 22 0 0 1 432 320Z",
      "width": 23
    },
    {
      "d": "M306 548H462A22 22 0 0 1 484 570V726A22 22 0 0 1 462 748H306A22 22 0 0 1 284 726V570A22 22 0 0 1 306 548Z",
      "width": 23
    },
    {
      "d": "M538 548H694A22 22 0 0 1 716 570V726A22 22 0 0 1 694 748H538A22 22 0 0 1 516 726V570A22 22 0 0 1 538 548Z",
      "width": 23
    },
    {
      "d": "M462 420A48 48 0 1 0 558 420A48 48 0 1 0 462 420Z",
      "width": 18
    },
    {
      "d": "M352 668L384 604L416 668Z",
      "width": 18
    },
    {
      "d": "M586 618H646",
      "width": 18
    },
    {
      "d": "M616 588V648",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(700 500) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(700 500) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(300 260) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#ff6ca8",
      "#ffc24a"
    ],
    "dark": [
      "#ff8cc0",
      "#ffd06a"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -10
    },
    "accent": {
      "y": -14
    }
  }
};

export const meta = {
  "slug": "blocks",
  "name": "Building blocks",
  "group": "Kids",
  "motion": "float",
  "component": "PrequelBuildingBlocksPictogram"
};

export function createPrequelBuildingBlocksPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
