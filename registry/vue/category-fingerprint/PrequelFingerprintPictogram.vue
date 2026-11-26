<script>
export const definition = {
  "slug": "fingerprint",
  "name": "Fingerprint",
  "group": "Security",
  "theme": "alert",
  "keywords": [
    "fingerprint",
    "security",
    "identity",
    "biometric",
    "access"
  ],
  "description": "Four nested fingerprint ridges that close towards the centre, over a split orb.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M300 600C300 420 390 280 512 280C634 280 724 420 724 600",
      "width": 23
    },
    {
      "d": "M356 640C356 480 414 348 512 348C610 348 668 480 668 640",
      "width": 23
    },
    {
      "d": "M412 680C412 550 444 424 512 424C580 424 612 550 612 680",
      "width": 23
    },
    {
      "d": "M468 720C468 620 480 500 512 500C544 500 556 620 556 720",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -119.06A120 120 0 1 0 -15 119.06Z",
      "transform": "translate(512 512) rotate(0)"
    },
    {
      "d": "M15 -119.06A120 120 0 0 1 15 119.06Z",
      "transform": "translate(512 512) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#ff6a6a",
      "#7a6cff"
    ],
    "dark": [
      "#ff8a8a",
      "#9a8cff"
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
