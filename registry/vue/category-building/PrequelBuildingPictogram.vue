<script>
export const definition = {
  "slug": "building",
  "name": "Building",
  "group": "Real estate",
  "theme": "indigo",
  "keywords": [
    "building",
    "estate",
    "city",
    "office",
    "property"
  ],
  "description": "Two neighbouring towers with lit windows, a door and an antenna, around a tall split orb.",
  "motion": "float",
  "ink": [
    {
      "d": "M276 340H524A26 26 0 0 1 550 366V738A26 26 0 0 1 524 764H276A26 26 0 0 1 250 738V366A26 26 0 0 1 276 340Z",
      "width": 23
    },
    {
      "d": "M602 226H770A24 24 0 0 1 794 250V740A24 24 0 0 1 770 764H602A24 24 0 0 1 578 740V250A24 24 0 0 1 602 226Z",
      "width": 23
    },
    {
      "d": "M308 390H352A8 8 0 0 1 360 398V432A8 8 0 0 1 352 440H308A8 8 0 0 1 300 432V398A8 8 0 0 1 308 390Z",
      "fill": true
    },
    {
      "d": "M448 390H492A8 8 0 0 1 500 398V432A8 8 0 0 1 492 440H448A8 8 0 0 1 440 432V398A8 8 0 0 1 448 390Z",
      "fill": true
    },
    {
      "d": "M308 480H352A8 8 0 0 1 360 488V522A8 8 0 0 1 352 530H308A8 8 0 0 1 300 522V488A8 8 0 0 1 308 480Z",
      "fill": true
    },
    {
      "d": "M448 480H492A8 8 0 0 1 500 488V522A8 8 0 0 1 492 530H448A8 8 0 0 1 440 522V488A8 8 0 0 1 448 480Z",
      "fill": true
    },
    {
      "d": "M372 650H428A12 12 0 0 1 440 662V752A12 12 0 0 1 428 764H372A12 12 0 0 1 360 752V662A12 12 0 0 1 372 650Z",
      "width": 23
    },
    {
      "d": "M628 286H664A8 8 0 0 1 672 294V326A8 8 0 0 1 664 334H628A8 8 0 0 1 620 326V294A8 8 0 0 1 628 286Z",
      "fill": true
    },
    {
      "d": "M712 286H748A8 8 0 0 1 756 294V326A8 8 0 0 1 748 334H712A8 8 0 0 1 704 326V294A8 8 0 0 1 712 286Z",
      "fill": true
    },
    {
      "d": "M628 376H664A8 8 0 0 1 672 384V416A8 8 0 0 1 664 424H628A8 8 0 0 1 620 416V384A8 8 0 0 1 628 376Z",
      "fill": true
    },
    {
      "d": "M712 376H748A8 8 0 0 1 756 384V416A8 8 0 0 1 748 424H712A8 8 0 0 1 704 416V384A8 8 0 0 1 712 376Z",
      "fill": true
    },
    {
      "d": "M686 226V162",
      "width": 18
    },
    {
      "d": "M674 148A12 12 0 1 0 698 148A12 12 0 1 0 674 148Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-16 -116.91A118 118 0 1 0 -16 116.91Z",
      "transform": "translate(512 548) rotate(0)"
    },
    {
      "d": "M16 -116.91A118 118 0 0 1 16 116.91Z",
      "transform": "translate(512 548) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(248 280) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#5b6cff",
      "#38d4b0"
    ],
    "dark": [
      "#7c8bff",
      "#6fe6c8"
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
