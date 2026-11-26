<script>
export const definition = {
  "slug": "palette",
  "name": "Palette",
  "group": "Design",
  "theme": "pink",
  "keywords": [
    "palette",
    "paint",
    "colour",
    "design"
  ],
  "description": "A painter's palette with a thumb hole and four paint wells filled from one gradient.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M512 240C700 240 828 356 828 512C828 606 770 664 680 664C620 664 596 622 618 574C640 526 612 492 552 492H504C382 492 284 434 284 352C284 282 380 240 512 240Z",
      "width": 23
    },
    {
      "d": "M644 592A46 58 0 1 0 736 592A46 58 0 1 0 644 592Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-11 -71.15A72 72 0 1 0 -11 71.15Z",
      "transform": "translate(790 380) rotate(0)"
    },
    {
      "d": "M11 -71.15A72 72 0 0 1 11 71.15Z",
      "transform": "translate(790 380) rotate(0)"
    },
    {
      "d": "M364 360A26 26 0 1 0 416 360A26 26 0 1 0 364 360Z"
    },
    {
      "d": "M454 330A26 26 0 1 0 506 330A26 26 0 1 0 454 330Z"
    },
    {
      "d": "M550 360A26 26 0 1 0 602 360A26 26 0 1 0 550 360Z"
    },
    {
      "d": "M624 414A26 26 0 1 0 676 414A26 26 0 1 0 624 414Z"
    }
  ],
  "palette": {
    "light": [
      "#ff6ca8",
      "#c06cff"
    ],
    "dark": [
      "#ff8cc0",
      "#d08cff"
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
