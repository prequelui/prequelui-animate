<script>
export const definition = {
  "slug": "heart-rate",
  "name": "Heart rate",
  "group": "Health",
  "theme": "red",
  "keywords": [
    "heart",
    "pulse",
    "health",
    "care"
  ],
  "description": "A heart outline crossed by a pulse trace, with an orb and a comet behind.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M512 690C420 622 280 536 280 414C280 334 340 282 410 282C462 282 500 312 512 352C524 312 562 282 614 282C684 282 744 334 744 414C744 536 604 622 512 690Z",
      "width": 23
    },
    {
      "d": "M340 470H426L466 402L520 542L560 470H684",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(760 332) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(760 332) rotate(0)"
    },
    {
      "d": "M110 0C60.5 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 60.5 17 110 0Z",
      "transform": "translate(262 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#ff6a6a",
      "#ff9a5c"
    ],
    "dark": [
      "#ff8a8a",
      "#ffb07c"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "scale": 1.08
    }
  }
};
</script>

<script setup>
import CategoryPictogram from "./category-core.vue";
</script>

<template>
  <CategoryPictogram :definition="definition" />
</template>
