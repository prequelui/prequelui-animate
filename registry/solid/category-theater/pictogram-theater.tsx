// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "theater",
  "name": "Theatre masks",
  "group": "Culture",
  "theme": "plum",
  "keywords": [
    "theatre",
    "masks",
    "culture",
    "drama",
    "show"
  ],
  "description": "A smiling mask and a pensive mask leaning towards each other over a split orb.",
  "motion": "swing",
  "ink": [
    {
      "d": "M220 400C220 308 290 260 360 300C432 340 452 440 424 552C400 650 330 690 272 662C226 610 220 486 220 400Z",
      "width": 23,
      "transform": "rotate(-8 360 480)"
    },
    {
      "d": "M292 420A18 18 0 1 0 328 420A18 18 0 1 0 292 420Z",
      "fill": true,
      "transform": "rotate(-8 360 480)"
    },
    {
      "d": "M362 428A18 18 0 1 0 398 428A18 18 0 1 0 362 428Z",
      "fill": true,
      "transform": "rotate(-8 360 480)"
    },
    {
      "d": "M290 516Q336 558 386 512",
      "width": 20,
      "transform": "rotate(-8 360 480)"
    },
    {
      "d": "M804 400C804 308 734 260 664 300C592 340 572 440 600 552C624 650 694 690 752 662C798 610 804 486 804 400Z",
      "width": 23,
      "transform": "rotate(8 664 480)"
    },
    {
      "d": "M626 428A18 18 0 1 0 662 428A18 18 0 1 0 626 428Z",
      "fill": true,
      "transform": "rotate(8 664 480)"
    },
    {
      "d": "M696 420A18 18 0 1 0 732 420A18 18 0 1 0 696 420Z",
      "fill": true,
      "transform": "rotate(8 664 480)"
    },
    {
      "d": "M640 548Q686 510 732 548",
      "width": 20,
      "transform": "rotate(8 664 480)"
    }
  ],
  "accent": [
    {
      "d": "M-16 -116.91A118 118 0 1 0 -16 116.91Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M16 -116.91A118 118 0 0 1 16 116.91Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M88 0C48.4 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 48.4 14 88 0Z",
      "transform": "translate(300 270) rotate(150)"
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
      "rotate": -3
    },
    "accent": {
      "y": -8
    }
  }
};

export function PrequelTheatreMasksPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
