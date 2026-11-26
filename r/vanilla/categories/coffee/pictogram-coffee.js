import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "coffee",
  "name": "Coffee",
  "group": "Food",
  "theme": "citrus",
  "keywords": [
    "coffee",
    "cafe",
    "cup",
    "drink",
    "takeaway"
  ],
  "description": "A takeaway cup with a wide lid, a tapered body and three comets rising as steam.",
  "motion": "comet",
  "ink": [
    {
      "d": "M326 286H698A26 26 0 0 1 724 312V348A26 26 0 0 1 698 374H326A26 26 0 0 1 300 348V312A26 26 0 0 1 326 286Z",
      "width": 23
    },
    {
      "d": "M330 374H694L652 764Q648 796 616 796H408Q376 796 372 764Z",
      "width": 23
    },
    {
      "d": "M352 526H672",
      "width": 20
    },
    {
      "d": "M564 400V500",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -102.91A104 104 0 1 0 -15 102.91Z",
      "transform": "translate(730 600) rotate(12)"
    },
    {
      "d": "M15 -102.91A104 104 0 0 1 15 102.91Z",
      "transform": "translate(730 600) rotate(12)"
    },
    {
      "d": "M92 0C50.6 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 50.6 14 92 0Z",
      "transform": "translate(430 256) rotate(-104)"
    },
    {
      "d": "M112 0C61.6 -16 16 -16 0 -16A16 16 0 0 0 0 16C16 16 61.6 16 112 0Z",
      "transform": "translate(512 238) rotate(-94)"
    },
    {
      "d": "M80 0C44 -12 12 -12 0 -12A12 12 0 0 0 0 12C12 12 44 12 80 0Z",
      "transform": "translate(594 256) rotate(-84)"
    }
  ],
  "palette": {
    "light": [
      "#ffb24a",
      "#ff6a5c"
    ],
    "dark": [
      "#ffc46a",
      "#ff8a7c"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 22,
      "y": -18
    }
  }
};

export const meta = {
  "slug": "coffee",
  "name": "Coffee",
  "group": "Food",
  "motion": "comet",
  "component": "PrequelCoffeePictogram"
};

export function createPrequelCoffeePictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
