// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "library",
  "name": "Library",
  "group": "Education",
  "theme": "amber",
  "keywords": [
    "book",
    "read",
    "library",
    "study"
  ],
  "description": "An open book with a visible spine, an orb in the right page and a comet above.",
  "motion": "float",
  "ink": [
    {
      "d": "M512 322C430 272 330 262 240 282V702C330 682 430 692 512 742C594 692 694 682 784 702V282C694 262 594 272 512 322Z",
      "width": 23
    },
    {
      "d": "M512 322V742",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-14 -99.02A100 100 0 1 0 -14 99.02Z",
      "transform": "translate(700 380) rotate(0)"
    },
    {
      "d": "M14 -99.02A100 100 0 0 1 14 99.02Z",
      "transform": "translate(700 380) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(320 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#ffc24a",
      "#ff7a5c"
    ],
    "dark": [
      "#ffd06a",
      "#ff9a7c"
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

export function PrequelLibraryPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
