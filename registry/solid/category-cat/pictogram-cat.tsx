// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "cat",
  "name": "Cat",
  "group": "Animals",
  "theme": "forest",
  "keywords": [
    "cat",
    "pet",
    "animal",
    "kitten",
    "whiskers"
  ],
  "description": "A cat head with pointed ears, slit pupils, a small nose and four whiskers.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M350 430C350 318 420 258 512 258C604 258 674 318 674 430V540C674 660 600 740 512 740C424 740 350 660 350 540Z",
      "width": 23
    },
    {
      "d": "M362 344L330 190L470 272",
      "width": 20
    },
    {
      "d": "M662 344L694 190L554 272",
      "width": 20
    },
    {
      "d": "M418 470A32 38 0 1 0 482 470A32 38 0 1 0 418 470Z",
      "width": 20
    },
    {
      "d": "M542 470A32 38 0 1 0 606 470A32 38 0 1 0 542 470Z",
      "width": 20
    },
    {
      "d": "M439 470A11 11 0 1 0 461 470A11 11 0 1 0 439 470Z",
      "fill": true
    },
    {
      "d": "M563 470A11 11 0 1 0 585 470A11 11 0 1 0 563 470Z",
      "fill": true
    },
    {
      "d": "M486 564H538L512 592Z",
      "fill": true
    },
    {
      "d": "M512 592V620",
      "width": 16
    },
    {
      "d": "M512 620Q480 650 452 626",
      "width": 16
    },
    {
      "d": "M512 620Q544 650 572 626",
      "width": 16
    },
    {
      "d": "M420 574L290 552",
      "width": 16
    },
    {
      "d": "M420 606L300 624",
      "width": 16
    },
    {
      "d": "M604 574L734 552",
      "width": 16
    },
    {
      "d": "M604 606L724 624",
      "width": 16
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(760 360) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(760 360) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(260 300) rotate(150)"
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
      "rotate": -2.4
    },
    "accent": {
      "x": 12,
      "y": -6
    }
  }
};

export function PrequelCatPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
