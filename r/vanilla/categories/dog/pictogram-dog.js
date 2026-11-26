import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "dog",
  "name": "Dog",
  "group": "Animals",
  "theme": "forest",
  "keywords": [
    "dog",
    "pet",
    "animal",
    "puppy",
    "vet"
  ],
  "description": "A friendly dog head with two folded ears, a round muzzle and a split orb behind.",
  "motion": "bounce",
  "ink": [
    {
      "d": "M340 430C340 308 420 244 512 244C604 244 684 308 684 430V544C684 664 610 744 512 744C414 744 340 664 340 544Z",
      "width": 23
    },
    {
      "d": "M356 372C306 372 280 330 292 274C326 292 352 328 366 360Z",
      "width": 20
    },
    {
      "d": "M668 372C718 372 744 330 732 274C698 292 672 328 658 360Z",
      "width": 20
    },
    {
      "d": "M436 486A16 16 0 1 0 468 486A16 16 0 1 0 436 486Z",
      "fill": true
    },
    {
      "d": "M556 486A16 16 0 1 0 588 486A16 16 0 1 0 556 486Z",
      "fill": true
    },
    {
      "d": "M420 596A92 62 0 1 0 604 596A92 62 0 1 0 420 596Z",
      "width": 20
    },
    {
      "d": "M486 578A26 20 0 1 0 538 578A26 20 0 1 0 486 578Z",
      "fill": true
    },
    {
      "d": "M512 600V636",
      "width": 18
    },
    {
      "d": "M512 636Q474 674 446 648",
      "width": 18
    },
    {
      "d": "M512 636Q550 674 578 648",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(748 400) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(748 400) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(270 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#38d4b0",
      "#a8d94a"
    ],
    "dark": [
      "#6fe6c8",
      "#c0e87a"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -12
    },
    "accent": {
      "y": -10
    }
  }
};

export const meta = {
  "slug": "dog",
  "name": "Dog",
  "group": "Animals",
  "motion": "bounce",
  "component": "PrequelDogPictogram"
};

export function createPrequelDogPictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
