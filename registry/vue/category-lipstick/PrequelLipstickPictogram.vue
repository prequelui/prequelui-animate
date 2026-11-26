<script>
export const definition = {
  "slug": "lipstick",
  "name": "Lipstick",
  "group": "Beauty",
  "theme": "rose",
  "keywords": [
    "lipstick",
    "makeup",
    "beauty",
    "cosmetic",
    "colour"
  ],
  "description": "An open lipstick with a bevelled bullet, a collar ring and a split orb behind the cap.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M434 548H590A24 24 0 0 1 614 572V760A24 24 0 0 1 590 784H434A24 24 0 0 1 410 760V572A24 24 0 0 1 434 548Z",
      "width": 23
    },
    {
      "d": "M410 508H614A20 20 0 0 1 634 528V540A20 20 0 0 1 614 560H410A20 20 0 0 1 390 540V528A20 20 0 0 1 410 508Z",
      "width": 23
    },
    {
      "d": "M432 508V420L512 300L592 420V508Z",
      "width": 23
    },
    {
      "d": "M410 722H614",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(710 382) rotate(10)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(710 382) rotate(10)"
    },
    {
      "d": "M96 0C52.8 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 52.8 15 96 0Z",
      "transform": "translate(300 300) rotate(148)"
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
    "main": {
      "rotate": -2.4
    },
    "accent": {
      "x": 12,
      "y": -6
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
