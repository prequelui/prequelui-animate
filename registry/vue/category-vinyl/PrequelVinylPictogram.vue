<script>
export const definition = {
  "slug": "vinyl",
  "name": "Vinyl",
  "group": "Music",
  "theme": "violet",
  "keywords": [
    "vinyl",
    "record",
    "disc",
    "player"
  ],
  "description": "A record with two grooves, a label, a spindle hole and a radial tick.",
  "motion": "spin",
  "ink": [
    {
      "d": "M260 512A252 252 0 1 0 764 512A252 252 0 1 0 260 512Z",
      "width": 23
    },
    {
      "d": "M334 512A178 178 0 1 0 690 512A178 178 0 1 0 334 512Z",
      "width": 23
    },
    {
      "d": "M426 512A86 86 0 1 0 598 512A86 86 0 1 0 426 512Z",
      "width": 23
    },
    {
      "d": "M490 512A22 22 0 1 0 534 512A22 22 0 1 0 490 512Z",
      "fill": true
    },
    {
      "d": "M512 512L648 392",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-13 -89.06A90 90 0 1 0 -13 89.06Z",
      "transform": "translate(780 300) rotate(0)"
    },
    {
      "d": "M13 -89.06A90 90 0 0 1 13 89.06Z",
      "transform": "translate(780 300) rotate(0)"
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
      "rotate": 10
    },
    "accent": {
      "x": 10
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
