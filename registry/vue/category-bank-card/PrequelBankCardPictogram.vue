<script>
export const definition = {
  "slug": "bank-card",
  "name": "Bank card",
  "group": "Finance",
  "theme": "green",
  "keywords": [
    "card",
    "payment",
    "credit",
    "bank"
  ],
  "description": "A payment card with a magnetic stripe, a chip and a split orb behind the right edge.",
  "motion": "orb",
  "ink": [
    {
      "d": "M230 336H794A40 40 0 0 1 834 376V652A40 40 0 0 1 794 692H230A40 40 0 0 1 190 652V376A40 40 0 0 1 230 336Z",
      "width": 23
    },
    {
      "d": "M224 398H800A10 10 0 0 1 810 408V436A10 10 0 0 1 800 446H224A10 10 0 0 1 214 436V408A10 10 0 0 1 224 398Z",
      "fill": true
    },
    {
      "d": "M286 492H344A14 14 0 0 1 358 506V544A14 14 0 0 1 344 558H286A14 14 0 0 1 272 544V506A14 14 0 0 1 286 492Z",
      "width": 23
    },
    {
      "d": "M556 540H700",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-15 -110.99A112 112 0 1 0 -15 110.99Z",
      "transform": "translate(742 500) rotate(0)"
    },
    {
      "d": "M15 -110.99A112 112 0 0 1 15 110.99Z",
      "transform": "translate(742 500) rotate(0)"
    }
  ],
  "palette": {
    "light": [
      "#38d4b0",
      "#5b6cff"
    ],
    "dark": [
      "#6fe6c8",
      "#7c8bff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 16,
      "y": -10
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
