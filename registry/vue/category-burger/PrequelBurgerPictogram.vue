<script>
export const definition = {
  "slug": "burger",
  "name": "Burger",
  "group": "Food",
  "theme": "citrus",
  "keywords": [
    "burger",
    "food",
    "restaurant",
    "fast",
    "lunch"
  ],
  "description": "A stacked burger with a domed bun, sesame seeds, lettuce, cheese and a split orb behind.",
  "motion": "orb",
  "ink": [
    {
      "d": "M244 480C244 360 366 292 512 292C658 292 780 360 780 480Z",
      "width": 23
    },
    {
      "d": "M415 400A15 9 0 1 0 445 400A15 9 0 1 0 415 400Z",
      "fill": true
    },
    {
      "d": "M513 372A17 10 0 1 0 547 372A17 10 0 1 0 513 372Z",
      "fill": true
    },
    {
      "d": "M608 408A14 9 0 1 0 636 408A14 9 0 1 0 608 408Z",
      "fill": true
    },
    {
      "d": "M246 512C300 484 332 540 386 512C440 484 472 540 526 512C580 484 612 540 666 512C714 486 746 534 778 512",
      "width": 23
    },
    {
      "d": "M260 596H764",
      "width": 22
    },
    {
      "d": "M420 596V640Q420 664 444 664Q468 664 468 640V596",
      "width": 18
    },
    {
      "d": "M576 596V640Q576 664 600 664Q624 664 624 640V596",
      "width": 18
    },
    {
      "d": "M316 612H708A30 30 0 0 1 738 642V664A30 30 0 0 1 708 694H316A30 30 0 0 1 286 664V642A30 30 0 0 1 316 612Z",
      "width": 23
    },
    {
      "d": "M286 704H738C738 764 650 792 512 792C374 792 286 764 286 704Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -106.95A108 108 0 1 0 -15 106.95Z",
      "transform": "translate(772 524) rotate(-8)"
    },
    {
      "d": "M15 -106.95A108 108 0 0 1 15 106.95Z",
      "transform": "translate(772 524) rotate(-8)"
    },
    {
      "d": "M100 0C55 -16 16 -16 0 -16A16 16 0 0 0 0 16C16 16 55 16 100 0Z",
      "transform": "translate(240 330) rotate(152)"
    }
  ],
  "palette": {
    "light": [
      "#ffb24a",
      "#ff6a5c"
    ],
    "dark": [
      "#ffc46a",
      "#ff8a7c"
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
