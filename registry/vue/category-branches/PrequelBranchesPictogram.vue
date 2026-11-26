<script>
export const definition = {
  "slug": "branches",
  "name": "Branches",
  "group": "Development",
  "theme": "teal",
  "keywords": [
    "git",
    "branch",
    "merge",
    "version"
  ],
  "description": "Two commits on a trunk and one on a branch, with an orb behind the fork.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M360 330V650",
      "width": 24
    },
    {
      "d": "M360 520C480 520 520 520 590 520",
      "width": 24
    },
    {
      "d": "M310 280A50 50 0 1 0 410 280A50 50 0 1 0 310 280Z",
      "width": 23
    },
    {
      "d": "M310 700A50 50 0 1 0 410 700A50 50 0 1 0 310 700Z",
      "width": 23
    },
    {
      "d": "M590 520A50 50 0 1 0 690 520A50 50 0 1 0 590 520Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-14 -99.02A100 100 0 1 0 -14 99.02Z",
      "transform": "translate(748 344) rotate(0)"
    },
    {
      "d": "M14 -99.02A100 100 0 0 1 14 99.02Z",
      "transform": "translate(748 344) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#2fd3c0",
      "#46a4ff"
    ],
    "dark": [
      "#5fe6d4",
      "#6cbaff"
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
