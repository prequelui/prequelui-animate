// @ts-nocheck
import { CategoryPictogram } from "./category-core";

export const definition = {
  "slug": "mirror",
  "name": "Hand mirror",
  "group": "Beauty",
  "theme": "rose",
  "keywords": [
    "mirror",
    "beauty",
    "vanity",
    "reflection",
    "salon"
  ],
  "description": "A hand mirror with a double rim and a tapered handle, its glass holding a split orb.",
  "motion": "orb",
  "ink": [
    {
      "d": "M314 400A198 198 0 1 0 710 400A198 198 0 1 0 314 400Z",
      "width": 23
    },
    {
      "d": "M362 400A150 150 0 1 0 662 400A150 150 0 1 0 362 400Z",
      "width": 23
    },
    {
      "d": "M486 596L470 794Q468 824 500 824H524Q556 824 554 794L538 596",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -102.91A104 104 0 1 0 -15 102.91Z",
      "transform": "translate(512 400) rotate(0)"
    },
    {
      "d": "M15 -102.91A104 104 0 0 1 15 102.91Z",
      "transform": "translate(512 400) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(780 280) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#ff7ca8",
      "#ff9a5c"
    ],
    "dark": [
      "#ff9ac0",
      "#ffb07c"
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

export function PrequelHandMirrorPictogram(props) {
  return <CategoryPictogram definition={definition} {...props} />;
}
