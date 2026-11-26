<script>
export const definition = {
  "slug": "megaphone",
  "name": "Megaphone",
  "group": "Jobs",
  "theme": "blue",
  "keywords": [
    "megaphone",
    "hiring",
    "announce",
    "job",
    "recruit"
  ],
  "description": "A handheld megaphone with a broad horn and three sound comets spreading to the right.",
  "motion": "comet",
  "ink": [
    {
      "d": "M300 470H500L700 340V684L500 554H300Z",
      "width": 23
    },
    {
      "d": "M380 554V680H470V554",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(512 500) rotate(0)"
    },
    {
      "d": "M100 0C55 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 55 14 100 0Z",
      "transform": "translate(720 440) rotate(-20)"
    },
    {
      "d": "M120 0C66 -16 16 -16 0 -16A16 16 0 0 0 0 16C16 16 66 16 120 0Z",
      "transform": "translate(728 512) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 49.5 13 90 0Z",
      "transform": "translate(720 584) rotate(20)"
    }
  ],
  "palette": {
    "light": [
      "#4aa8ff",
      "#7a6cff"
    ],
    "dark": [
      "#74baff",
      "#9a8cff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 22,
      "y": -18
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
