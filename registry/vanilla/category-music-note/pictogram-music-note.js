import { createCategoryPictogram } from "./category-core.js";

export const definition = {
  "slug": "music-note",
  "name": "Music note",
  "group": "Music",
  "theme": "violet",
  "keywords": [
    "note",
    "music",
    "sound",
    "audio"
  ],
  "description": "A beamed pair of notes with filled heads and a split orb behind the stem.",
  "motion": "bounce",
  "ink": [
    {
      "d": "M288 672A88 64 0 1 0 464 672A88 64 0 1 0 288 672Z",
      "fill": true,
      "transform": "rotate(-20 376 672)"
    },
    {
      "d": "M536 608A88 64 0 1 0 712 608A88 64 0 1 0 536 608Z",
      "fill": true,
      "transform": "rotate(-20 624 608)"
    },
    {
      "d": "M452 660V340M700 596V276",
      "width": 26
    },
    {
      "d": "M452 340L700 276",
      "width": 30
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(760 400) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(760 400) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#8a6cff",
      "#e06cff"
    ],
    "dark": [
      "#a48cff",
      "#ec8cff"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -12
    },
    "accent": {
      "y": -10
    }
  }
};

export const meta = {
  "slug": "music-note",
  "name": "Music note",
  "group": "Music",
  "motion": "bounce",
  "component": "PrequelMusicNotePictogram"
};

export function createPrequelMusicNotePictogram(root, options = {}) {
  return createCategoryPictogram(root, definition, options);
}
