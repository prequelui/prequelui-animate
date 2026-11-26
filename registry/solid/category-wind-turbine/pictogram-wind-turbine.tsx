// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "wind-turbine",
  "name": "Wind turbine",
  "group": "Energy",
  "theme": "forest",
  "keywords": [
    "wind",
    "turbine",
    "energy",
    "renewable",
    "power"
  ],
  "description": "A three-blade wind turbine on a tapered tower, its hub centred on a wide split orb.",
  "motion": "spin",
  "ink": [
    {
      "d": "M488 786L505 430H519L536 786Z",
      "width": 23
    },
    {
      "d": "M474 400A38 38 0 1 0 550 400A38 38 0 1 0 474 400Z",
      "width": 23
    },
    {
      "d": "M500 400A12 12 0 1 0 524 400A12 12 0 1 0 500 400Z",
      "fill": true
    },
    {
      "d": "M512 400C520 312 558 234 618 194C628 272 588 360 512 400Z",
      "width": 20
    },
    {
      "d": "M512 400C520 312 558 234 618 194C628 272 588 360 512 400Z",
      "width": 20,
      "transform": "rotate(120 512 400)"
    },
    {
      "d": "M512 400C520 312 558 234 618 194C628 272 588 360 512 400Z",
      "width": 20,
      "transform": "rotate(240 512 400)"
    },
    {
      "d": "M454 786H570A10 10 0 0 1 580 796V806A10 10 0 0 1 570 816H454A10 10 0 0 1 444 806V796A10 10 0 0 1 454 786Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-16 -118.93A120 120 0 1 0 -16 118.93Z",
      "transform": "translate(512 400) rotate(0)"
    },
    {
      "d": "M16 -118.93A120 120 0 0 1 16 118.93Z",
      "transform": "translate(512 400) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 300) rotate(-30)"
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
      "rotate": 10
    },
    "accent": {
      "x": 10
    }
  }
};

export function PrequelWindTurbinePictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
