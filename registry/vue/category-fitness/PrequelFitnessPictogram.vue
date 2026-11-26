<script>
export const definition = {
  "slug": "fitness",
  "name": "Fitness",
  "group": "Sport",
  "theme": "lime",
  "keywords": [
    "dumbbell",
    "gym",
    "fitness",
    "workout"
  ],
  "description": "A tilted dumbbell with four stacked plates and a split orb behind the bar.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M352 512H672",
      "width": 30,
      "transform": "rotate(-18 512 512)"
    },
    {
      "d": "M224 388H254A28 28 0 0 1 282 416V608A28 28 0 0 1 254 636H224A28 28 0 0 1 196 608V416A28 28 0 0 1 224 388Z",
      "width": 23,
      "transform": "rotate(-18 512 512)"
    },
    {
      "d": "M304 432H316A22 22 0 0 1 338 454V570A22 22 0 0 1 316 592H304A22 22 0 0 1 282 570V454A22 22 0 0 1 304 432Z",
      "width": 23,
      "transform": "rotate(-18 512 512)"
    },
    {
      "d": "M770 388H800A28 28 0 0 1 828 416V608A28 28 0 0 1 800 636H770A28 28 0 0 1 742 608V416A28 28 0 0 1 770 388Z",
      "width": 23,
      "transform": "rotate(-18 512 512)"
    },
    {
      "d": "M708 432H720A22 22 0 0 1 742 454V570A22 22 0 0 1 720 592H708A22 22 0 0 1 686 570V454A22 22 0 0 1 708 432Z",
      "width": 23,
      "transform": "rotate(-18 512 512)"
    }
  ],
  "accent": [
    {
      "d": "M-14 -96.99A98 98 0 1 0 -14 96.99Z",
      "transform": "translate(740 344) rotate(0)"
    },
    {
      "d": "M14 -96.99A98 98 0 0 1 14 96.99Z",
      "transform": "translate(740 344) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(286 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#a8d94a",
      "#38d4b0"
    ],
    "dark": [
      "#c0e87a",
      "#6fe6c8"
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
