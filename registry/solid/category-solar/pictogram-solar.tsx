// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "solar",
  "name": "Solar panel",
  "group": "Energy",
  "theme": "volt",
  "keywords": [
    "solar",
    "energy",
    "panel",
    "sun",
    "renewable"
  ],
  "description": "A tilted solar array on a stand, its face split into cells, with a split orb sun above.",
  "motion": "shine",
  "ink": [
    {
      "d": "M240 560L380 380H840L700 560Z",
      "width": 23
    },
    {
      "d": "M330 470H770",
      "width": 16
    },
    {
      "d": "M410 560H820",
      "width": 16
    },
    {
      "d": "M444 380L370 560",
      "width": 16
    },
    {
      "d": "M604 380L530 560",
      "width": 16
    },
    {
      "d": "M764 380L690 560",
      "width": 16
    },
    {
      "d": "M470 560V720",
      "width": 22
    },
    {
      "d": "M554 560V720",
      "width": 22
    },
    {
      "d": "M410 740H614A10 10 0 0 1 624 750V760A10 10 0 0 1 614 770H410A10 10 0 0 1 400 760V750A10 10 0 0 1 410 740Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-14 -86.88A88 88 0 1 0 -14 86.88Z",
      "transform": "translate(790 280) rotate(0)"
    },
    {
      "d": "M14 -86.88A88 88 0 0 1 14 86.88Z",
      "transform": "translate(790 280) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 49.5 13 90 0Z",
      "transform": "translate(690 250) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#a8d94a",
      "#58c8ff"
    ],
    "dark": [
      "#c0e87a",
      "#7cd6ff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "scale": 1.12
    }
  }
};

export function PrequelSolarPanelPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
