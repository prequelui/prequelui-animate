<script>
export const definition = {
  "slug": "football",
  "name": "Football",
  "group": "Sport",
  "theme": "lime",
  "keywords": [
    "ball",
    "football",
    "soccer",
    "sport"
  ],
  "description": "A panel ball with a central pentagon and five seams, in front of a split orb.",
  "motion": "spin",
  "ink": [
    {
      "d": "M260 512A252 252 0 1 0 764 512A252 252 0 1 0 260 512Z",
      "width": 23
    },
    {
      "d": "M512 418L602 483L568 588H456L422 483Z",
      "width": 23
    },
    {
      "d": "M512 418V262",
      "width": 22
    },
    {
      "d": "M602 483H753",
      "width": 22
    },
    {
      "d": "M568 588L664 700",
      "width": 22
    },
    {
      "d": "M456 588L360 700",
      "width": 22
    },
    {
      "d": "M422 483H271",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-13 -89.06A90 90 0 1 0 -13 89.06Z",
      "transform": "translate(762 300) rotate(0)"
    },
    {
      "d": "M13 -89.06A90 90 0 0 1 13 89.06Z",
      "transform": "translate(762 300) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
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
