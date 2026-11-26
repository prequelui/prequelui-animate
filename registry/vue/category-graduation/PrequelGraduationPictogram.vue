<script>
export const definition = {
  "slug": "graduation",
  "name": "Graduation",
  "group": "Education",
  "theme": "amber",
  "keywords": [
    "cap",
    "school",
    "learn",
    "degree"
  ],
  "description": "A mortarboard with a curved cap base, a hanging tassel and an orb at the left.",
  "motion": "swing",
  "ink": [
    {
      "d": "M512 268L820 398L512 528L204 398Z",
      "width": 23
    },
    {
      "d": "M340 466V596C340 654 416 694 512 694C608 694 684 654 684 596V466",
      "width": 23
    },
    {
      "d": "M782 414V560",
      "width": 22
    },
    {
      "d": "M758 590A24 24 0 1 0 806 590A24 24 0 1 0 758 590Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(300 340) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(300 340) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(700 270) rotate(-22)"
    }
  ],
  "palette": {
    "light": [
      "#ffc24a",
      "#ff7a5c"
    ],
    "dark": [
      "#ffd06a",
      "#ff9a7c"
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
