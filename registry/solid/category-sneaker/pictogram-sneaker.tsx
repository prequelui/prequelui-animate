// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "sneaker",
  "name": "Sneaker",
  "group": "Fashion",
  "theme": "berry",
  "keywords": [
    "shoe",
    "sneaker",
    "footwear",
    "fashion",
    "run"
  ],
  "description": "A low sneaker in profile with a thick sole, laces and two comets leaving the toe.",
  "motion": "comet",
  "ink": [
    {
      "d": "M212 690C212 662 232 648 260 648H760C800 648 824 690 800 730C780 758 744 766 700 766H292C244 766 212 738 212 690Z",
      "width": 23
    },
    {
      "d": "M238 668V596C238 540 282 508 336 508H404L486 604L552 508H664C738 508 788 556 788 626V668",
      "width": 23
    },
    {
      "d": "M238 620C300 600 356 626 388 668",
      "width": 20
    },
    {
      "d": "M446 566L510 600",
      "width": 18
    },
    {
      "d": "M474 534L538 568",
      "width": 18
    },
    {
      "d": "M502 502L566 536",
      "width": 18
    },
    {
      "d": "M700 508V560",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(790 566) rotate(20)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(790 566) rotate(20)"
    },
    {
      "d": "M96 0C52.8 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 52.8 15 96 0Z",
      "transform": "translate(200 610) rotate(162)"
    },
    {
      "d": "M72 0C39.6 -12 12 -12 0 -12A12 12 0 0 0 0 12C12 12 39.6 12 72 0Z",
      "transform": "translate(184 664) rotate(160)"
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
      "x": 22,
      "y": -18
    }
  }
};

export function PrequelSneakerPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
