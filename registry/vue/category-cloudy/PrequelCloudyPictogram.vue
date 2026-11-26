<script>
export const definition = {
  "slug": "cloudy",
  "name": "Cloudy",
  "group": "Weather",
  "theme": "sky",
  "keywords": [
    "cloud",
    "weather",
    "sky",
    "overcast"
  ],
  "description": "A billowed cloud with a split orb peeking over its shoulder.",
  "motion": "float",
  "ink": [
    {
      "d": "M332 664C252 664 200 606 200 544C200 474 256 424 326 424C342 344 410 290 492 290C590 290 660 360 668 452C748 452 800 502 800 560C800 620 748 664 688 664Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(750 360) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(750 360) rotate(0)"
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
      "y": -10
    },
    "accent": {
      "y": -14
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
