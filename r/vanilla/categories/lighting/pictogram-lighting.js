import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "lighting",
  "name": "Lighting",
  "group": "Home",
  "theme": "orange",
  "keywords": [
    "lamp",
    "light",
    "interior",
    "home"
  ],
  "description": "A pendant lamp with a trapezoid shade, a stem and a base, over a split orb.",
  "motion": "swing",
  "ink": [
    {
      "d": "M352 296H672L748 512H276Z",
      "width": 23
    },
    {
      "d": "M512 512V716",
      "width": 24
    },
    {
      "d": "M428 716H596A22 22 0 0 1 618 738V738A22 22 0 0 1 596 760H428A22 22 0 0 1 406 738V738A22 22 0 0 1 428 716Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -108.97A110 110 0 1 0 -15 108.97Z",
      "transform": "translate(512 420) rotate(0)"
    },
    {
      "d": "M15 -108.97A110 110 0 0 1 15 108.97Z",
      "transform": "translate(512 420) rotate(0)"
    },
    {
      "d": "M100 0C55 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 55 15 100 0Z",
      "transform": "translate(740 300) rotate(-22)"
    }
  ],
  "palette": {
    "light": [
      "#ff7a5c",
      "#ff5ca8"
    ],
    "dark": [
      "#ff9a7c",
      "#ff7cc0"
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
  "slug": "lighting",
  "name": "Lighting",
  "group": "Home",
  "motion": "swing",
  "component": "PrequelLightingPictogram"
};

export function createPrequelLightingPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
