import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "folder",
  "name": "Folder",
  "group": "Administration",
  "theme": "slate",
  "keywords": [
    "folder",
    "file",
    "admin",
    "archive",
    "document"
  ],
  "description": "A tabbed folder with two ruled lines, standing in front of a warm split orb.",
  "motion": "orb",
  "ink": [
    {
      "d": "M220 350H430L482 412H804V742H220Z",
      "width": 23
    },
    {
      "d": "M300 520H720",
      "width": 18
    },
    {
      "d": "M300 580H620",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(750 620) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(750 620) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(260 300) rotate(150)"
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
      "x": 16,
      "y": -10
    }
  }
};

export const meta = {
  "slug": "folder",
  "name": "Folder",
  "group": "Administration",
  "motion": "orb",
  "component": "PrequelFolderPictogram"
};

export function createPrequelFolderPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
