// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "siren",
  "name": "Siren",
  "group": "Security",
  "theme": "alert",
  "keywords": [
    "siren",
    "alarm",
    "security",
    "alert",
    "emergency"
  ],
  "description": "A domed alarm on a plinth with three comets radiating from its crown.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M300 620C300 440 390 320 512 320C634 320 724 440 724 620Z",
      "width": 23
    },
    {
      "d": "M276 620H748A16 16 0 0 1 764 636V664A16 16 0 0 1 748 680H276A16 16 0 0 1 260 664V636A16 16 0 0 1 276 620Z",
      "width": 23
    },
    {
      "d": "M330 680V760",
      "width": 22
    },
    {
      "d": "M694 680V760",
      "width": 22
    },
    {
      "d": "M300 760H380",
      "width": 22
    },
    {
      "d": "M644 760H724",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-15 -108.97A110 110 0 1 0 -15 108.97Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M15 -108.97A110 110 0 0 1 15 108.97Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M80 0C44 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 44 13 80 0Z",
      "transform": "translate(380 280) rotate(-128)"
    },
    {
      "d": "M96 0C52.8 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 52.8 15 96 0Z",
      "transform": "translate(512 250) rotate(-90)"
    },
    {
      "d": "M80 0C44 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 44 13 80 0Z",
      "transform": "translate(644 280) rotate(-52)"
    }
  ],
  "palette": {
    "light": [
      "#ff6a6a",
      "#7a6cff"
    ],
    "dark": [
      "#ff8a8a",
      "#9a8cff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "scale": 1.08
    }
  }
};

export function PrequelSirenPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
