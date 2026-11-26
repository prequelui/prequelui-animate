// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "stroller",
  "name": "Stroller",
  "group": "Kids",
  "theme": "candy",
  "keywords": [
    "stroller",
    "pram",
    "baby",
    "kids",
    "family"
  ],
  "description": "A pram with a high rounded canopy, a deep basket, a push handle and two wheels.",
  "motion": "drive",
  "ink": [
    {
      "d": "M262 508C262 366 388 300 518 300C618 300 690 342 722 412H262Z",
      "width": 23
    },
    {
      "d": "M262 508H722L690 646H296Z",
      "width": 23
    },
    {
      "d": "M722 508L790 400",
      "width": 22
    },
    {
      "d": "M300 716A62 62 0 1 0 424 716A62 62 0 1 0 300 716Z",
      "width": 23
    },
    {
      "d": "M600 716A50 50 0 1 0 700 716A50 50 0 1 0 600 716Z",
      "width": 23
    },
    {
      "d": "M336 716A26 26 0 1 0 388 716A26 26 0 1 0 336 716Z",
      "width": 18
    },
    {
      "d": "M630 716A20 20 0 1 0 670 716A20 20 0 1 0 630 716Z",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(780 560) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(780 560) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(250 300) rotate(150)"
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
      "x": 8
    },
    "accent": {
      "x": -12,
      "y": -8
    }
  }
};

export function PrequelStrollerPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
