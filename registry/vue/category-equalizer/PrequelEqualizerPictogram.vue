<script>
export const definition = {
  "slug": "equalizer",
  "name": "Equalizer",
  "group": "Music",
  "theme": "violet",
  "keywords": [
    "equalizer",
    "levels",
    "audio",
    "bars"
  ],
  "description": "Four bottom-aligned levels in front of a wide split orb.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M347 460H347A29 29 0 0 1 376 489V671A29 29 0 0 1 347 700H347A29 29 0 0 1 318 671V489A29 29 0 0 1 347 460Z",
      "fill": true
    },
    {
      "d": "M461 312H461A29 29 0 0 1 490 341V671A29 29 0 0 1 461 700H461A29 29 0 0 1 432 671V341A29 29 0 0 1 461 312Z",
      "fill": true
    },
    {
      "d": "M575 520H575A29 29 0 0 1 604 549V671A29 29 0 0 1 575 700H575A29 29 0 0 1 546 671V549A29 29 0 0 1 575 520Z",
      "fill": true
    },
    {
      "d": "M689 400H689A29 29 0 0 1 718 429V671A29 29 0 0 1 689 700H689A29 29 0 0 1 660 671V429A29 29 0 0 1 689 400Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-21 -158.62A160 160 0 1 0 -21 158.62Z",
      "transform": "translate(512 512) rotate(0)"
    },
    {
      "d": "M21 -158.62A160 160 0 0 1 21 158.62Z",
      "transform": "translate(512 512) rotate(0)"
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
