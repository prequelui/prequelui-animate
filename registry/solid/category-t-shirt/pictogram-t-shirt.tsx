// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "t-shirt",
  "name": "T-shirt",
  "group": "Fashion",
  "theme": "berry",
  "keywords": [
    "shirt",
    "clothing",
    "fashion",
    "wear",
    "apparel"
  ],
  "description": "A short-sleeve tee with a rounded collar, a straight hem and a split orb behind the shoulder.",
  "motion": "orb",
  "ink": [
    {
      "d": "M366 292H452C462 336 486 352 512 352C538 352 562 336 572 292H658L754 392L660 474L622 440V790H402V440L364 474L270 392Z",
      "width": 23
    },
    {
      "d": "M402 742H622",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -102.91A104 104 0 1 0 -15 102.91Z",
      "transform": "translate(752 400) rotate(18)"
    },
    {
      "d": "M15 -102.91A104 104 0 0 1 15 102.91Z",
      "transform": "translate(752 400) rotate(18)"
    },
    {
      "d": "M96 0C52.8 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 52.8 15 96 0Z",
      "transform": "translate(272 320) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#ff5c8a",
      "#c06cff"
    ],
    "dark": [
      "#ff7ca4",
      "#d08cff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 16,
      "y": -10
    }
  }
};

export function PrequelTShirtPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
