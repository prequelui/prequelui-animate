import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "traffic-light",
  "name": "Traffic light",
  "group": "Auto",
  "theme": "steel",
  "keywords": [
    "traffic",
    "light",
    "signal",
    "road",
    "auto"
  ],
  "description": "A three-lamp traffic signal with rounded visors, each lamp filled from the same gradient.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M448 214H576A56 56 0 0 1 632 270V734A56 56 0 0 1 576 790H448A56 56 0 0 1 392 734V270A56 56 0 0 1 448 214Z",
      "width": 23
    },
    {
      "d": "M446 330A66 66 0 1 0 578 330A66 66 0 1 0 446 330Z",
      "width": 23
    },
    {
      "d": "M446 502A66 66 0 1 0 578 502A66 66 0 1 0 446 502Z",
      "width": 23
    },
    {
      "d": "M446 674A66 66 0 1 0 578 674A66 66 0 1 0 446 674Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M472 330A40 40 0 1 0 552 330A40 40 0 1 0 472 330Z"
    },
    {
      "d": "M472 502A40 40 0 1 0 552 502A40 40 0 1 0 472 502Z"
    },
    {
      "d": "M472 674A40 40 0 1 0 552 674A40 40 0 1 0 472 674Z"
    },
    {
      "d": "M80 0C44 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 44 13 80 0Z",
      "transform": "translate(700 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#7a8ba8",
      "#4aa8ff"
    ],
    "dark": [
      "#96a6c4",
      "#74baff"
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
  "slug": "traffic-light",
  "name": "Traffic light",
  "group": "Auto",
  "motion": "pulse",
  "component": "PrequelTrafficLightPictogram"
};

export function createPrequelTrafficLightPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
