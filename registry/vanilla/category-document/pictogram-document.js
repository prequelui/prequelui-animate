import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "document",
  "name": "Official document",
  "group": "Administration",
  "theme": "slate",
  "keywords": [
    "document",
    "certificate",
    "official",
    "admin",
    "seal"
  ],
  "description": "A ruled document with a folded corner, a round seal and two ribbon tails.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M324 220H700A24 24 0 0 1 724 244V780A24 24 0 0 1 700 804H324A24 24 0 0 1 300 780V244A24 24 0 0 1 324 220Z",
      "width": 23
    },
    {
      "d": "M620 220V320H724",
      "width": 18
    },
    {
      "d": "M360 390H620",
      "width": 18
    },
    {
      "d": "M360 440H664",
      "width": 18
    },
    {
      "d": "M360 490H600",
      "width": 18
    },
    {
      "d": "M486 630A74 74 0 1 0 634 630A74 74 0 1 0 486 630Z",
      "width": 23
    },
    {
      "d": "M524 630A36 36 0 1 0 596 630A36 36 0 1 0 524 630Z",
      "width": 18
    },
    {
      "d": "M560 700L528 800L570 768L612 800L580 700",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(780 400) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(780 400) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(240 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#7a8ba8",
      "#b06cff"
    ],
    "dark": [
      "#96a6c4",
      "#c58cff"
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
  "slug": "document",
  "name": "Official document",
  "group": "Administration",
  "motion": "pulse",
  "component": "PrequelOfficialDocumentPictogram"
};

export function createPrequelOfficialDocumentPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
