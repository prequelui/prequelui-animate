<script>
export const definition = {
  "slug": "sunglasses",
  "name": "Sunglasses",
  "group": "Fashion",
  "theme": "berry",
  "keywords": [
    "glasses",
    "sunglasses",
    "shades",
    "summer",
    "fashion"
  ],
  "description": "Two round tinted lenses joined by a bridge, with straight temples and a wide split orb.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M232 500A128 88 0 1 0 488 500A128 88 0 1 0 232 500Z",
      "width": 23
    },
    {
      "d": "M536 500A128 88 0 1 0 792 500A128 88 0 1 0 536 500Z",
      "width": 23
    },
    {
      "d": "M488 500Q512 468 536 500",
      "width": 23
    },
    {
      "d": "M232 476L170 450",
      "width": 20
    },
    {
      "d": "M792 476L854 450",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -117.04A118 118 0 1 0 -15 117.04Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M15 -117.04A118 118 0 0 1 15 117.04Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(298 330) rotate(150)"
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
