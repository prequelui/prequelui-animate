<script module>
  export const definition = {
  "slug": "bread",
  "name": "Bread",
  "group": "Food",
  "theme": "citrus",
  "keywords": [
    "bread",
    "bakery",
    "loaf",
    "bake",
    "baguette"
  ],
  "description": "A long scored loaf tilted across the grid, with a split orb behind and two crumbs flying.",
  "motion": "comet",
  "ink": [
    {
      "d": "M206 594C206 510 300 466 512 466C724 466 818 510 818 594C818 652 766 686 700 686H324C258 686 206 652 206 594Z",
      "width": 23
    },
    {
      "d": "M360 530L450 588",
      "width": 20
    },
    {
      "d": "M470 512L560 570",
      "width": 20
    },
    {
      "d": "M580 512L670 570",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-13 -80.96A82 82 0 1 0 -13 80.96Z",
      "transform": "translate(196 382) rotate(0)"
    },
    {
      "d": "M13 -80.96A82 82 0 0 1 13 80.96Z",
      "transform": "translate(196 382) rotate(0)"
    },
    {
      "d": "M100 0C55 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 55 15 100 0Z",
      "transform": "translate(760 330) rotate(-40)"
    },
    {
      "d": "M74 0C40.7 -12 12 -12 0 -12A12 12 0 0 0 0 12C12 12 40.7 12 74 0Z",
      "transform": "translate(808 382) rotate(-34)"
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
      "x": 22,
      "y": -18
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
