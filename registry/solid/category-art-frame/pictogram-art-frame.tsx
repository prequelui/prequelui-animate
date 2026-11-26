// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "art-frame",
  "name": "Art frame",
  "group": "Culture",
  "theme": "plum",
  "keywords": [
    "art",
    "frame",
    "culture",
    "gallery",
    "picture"
  ],
  "description": "A double picture frame holding a mountain, a sun and a quiet horizon line.",
  "motion": "float",
  "ink": [
    {
      "d": "M278 256H746A22 22 0 0 1 768 278V746A22 22 0 0 1 746 768H278A22 22 0 0 1 256 746V278A22 22 0 0 1 278 256Z",
      "width": 23
    },
    {
      "d": "M316 304H708A12 12 0 0 1 720 316V708A12 12 0 0 1 708 720H316A12 12 0 0 1 304 708V316A12 12 0 0 1 316 304Z",
      "width": 18
    },
    {
      "d": "M330 656L448 480L538 580L606 506L702 656Z",
      "width": 23
    },
    {
      "d": "M584 390A44 44 0 1 0 672 390A44 44 0 1 0 584 390Z",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(760 600) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(760 600) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(240 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#c06cff",
      "#8a6cff"
    ],
    "dark": [
      "#d08cff",
      "#a48cff"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -10
    },
    "accent": {
      "y": -14
    }
  }
};

export function PrequelArtFramePictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
