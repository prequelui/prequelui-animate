import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "keys",
  "name": "House keys",
  "group": "Real estate",
  "theme": "indigo",
  "keywords": [
    "keys",
    "house",
    "home",
    "rent",
    "estate"
  ],
  "description": "A house key turned across the grid, with a double-ring bow and three cut teeth.",
  "motion": "swing",
  "ink": [
    {
      "d": "M244 430A126 126 0 1 0 496 430A126 126 0 1 0 244 430Z",
      "width": 23,
      "transform": "rotate(-16 512 470)"
    },
    {
      "d": "M312 430A58 58 0 1 0 428 430A58 58 0 1 0 312 430Z",
      "width": 20,
      "transform": "rotate(-16 512 470)"
    },
    {
      "d": "M496 430H800",
      "width": 24,
      "transform": "rotate(-16 512 470)"
    },
    {
      "d": "M700 430V500",
      "width": 20,
      "transform": "rotate(-16 512 470)"
    },
    {
      "d": "M744 430V472",
      "width": 20,
      "transform": "rotate(-16 512 470)"
    },
    {
      "d": "M790 430V520",
      "width": 20,
      "transform": "rotate(-16 512 470)"
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(306 430) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(306 430) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(800 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#5b6cff",
      "#38d4b0"
    ],
    "dark": [
      "#7c8bff",
      "#6fe6c8"
    ]
  },
  "motionConfig": {
    "main": {
      "rotate": -3
    },
    "accent": {
      "y": -8
    }
  }
};

export const meta = {
  "slug": "keys",
  "name": "House keys",
  "group": "Real estate",
  "motion": "swing",
  "component": "PrequelHouseKeysPictogram"
};

export function createPrequelHouseKeysPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
