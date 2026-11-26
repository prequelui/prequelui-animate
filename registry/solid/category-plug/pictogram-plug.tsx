// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "plug",
  "name": "Power plug",
  "group": "Energy",
  "theme": "steel",
  "keywords": [
    "plug",
    "power",
    "energy",
    "socket",
    "charge"
  ],
  "description": "A two-pin plug with a rounded body, an indicator dot and a cable curling away.",
  "motion": "comet",
  "ink": [
    {
      "d": "M480 420H680A50 50 0 0 1 730 470V610A50 50 0 0 1 680 660H480A50 50 0 0 1 430 610V470A50 50 0 0 1 480 420Z",
      "width": 23
    },
    {
      "d": "M512 300H524A12 12 0 0 1 536 312V418A12 12 0 0 1 524 430H512A12 12 0 0 1 500 418V312A12 12 0 0 1 512 300Z",
      "width": 22
    },
    {
      "d": "M632 300H644A12 12 0 0 1 656 312V418A12 12 0 0 1 644 430H632A12 12 0 0 1 620 418V312A12 12 0 0 1 632 300Z",
      "width": 22
    },
    {
      "d": "M730 540C800 540 820 620 820 700C820 760 780 800 720 800",
      "width": 22
    },
    {
      "d": "M490 540A22 22 0 1 0 534 540A22 22 0 1 0 490 540Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(760 420) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(760 420) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(726 800) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#7a8ba8",
      "#4aa8ff"
    ],
    "dark": [
      "#96a6c4",
      "#74baff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 22,
      "y": -18
    }
  }
};

export function PrequelPowerPlugPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
