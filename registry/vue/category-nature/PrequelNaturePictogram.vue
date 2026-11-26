<script>
export const definition = {
  "slug": "nature",
  "name": "Nature",
  "group": "Weather",
  "theme": "sky",
  "keywords": [
    "leaf",
    "nature",
    "eco",
    "plant"
  ],
  "description": "A leaf with a midrib and two veins, in front of a split orb and a comet.",
  "motion": "swing",
  "ink": [
    {
      "d": "M290 724C290 476 470 298 752 278C752 540 588 724 290 724Z",
      "width": 23
    },
    {
      "d": "M290 724C446 606 596 470 752 278",
      "width": 22
    },
    {
      "d": "M390 640C420 560 470 500 540 456",
      "width": 20
    },
    {
      "d": "M470 574C500 512 550 462 614 426",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(760 340) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(760 340) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#58c8ff",
      "#8a6cff"
    ],
    "dark": [
      "#7cd6ff",
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
</script>

<script setup>
import CategoryPictogram from "./category-core.vue";
</script>

<template>
  <CategoryPictogram :definition="definition" />
</template>
