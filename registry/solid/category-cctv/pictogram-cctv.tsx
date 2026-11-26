// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "cctv",
  "name": "CCTV camera",
  "group": "Security",
  "theme": "alert",
  "keywords": [
    "cctv",
    "camera",
    "security",
    "watch",
    "surveillance"
  ],
  "description": "A wall camera with a hooded body, a round lens and a short mounting bracket.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M280 380H650L730 450V530L650 600H280Z",
      "width": 23
    },
    {
      "d": "M600 490A50 50 0 1 0 700 490A50 50 0 1 0 600 490Z",
      "width": 23
    },
    {
      "d": "M626 490A24 24 0 1 0 674 490A24 24 0 1 0 626 490Z",
      "fill": true
    },
    {
      "d": "M420 600V720",
      "width": 22
    },
    {
      "d": "M362 720H518A12 12 0 0 1 530 732V742A12 12 0 0 1 518 754H362A12 12 0 0 1 350 742V732A12 12 0 0 1 362 720Z",
      "width": 23
    },
    {
      "d": "M318 430A12 12 0 1 0 342 430A12 12 0 1 0 318 430Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(770 480) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(770 480) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(250 320) rotate(150)"
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
    "main": {
      "rotate": -2.4
    },
    "accent": {
      "x": 12,
      "y": -6
    }
  }
};

export function PrequelCCTVCameraPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
