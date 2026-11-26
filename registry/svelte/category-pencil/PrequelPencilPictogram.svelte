<script module>
  export const definition = {
  "slug": "pencil",
  "name": "Pencil",
  "group": "Education",
  "theme": "amber",
  "keywords": [
    "pencil",
    "write",
    "edit",
    "draw"
  ],
  "description": "A tilted pencil with a sharpened tip, an eraser block and a comet at the tail.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M448 236H576A18 18 0 0 1 594 254V570A18 18 0 0 1 576 588H448A18 18 0 0 1 430 570V254A18 18 0 0 1 448 236Z",
      "width": 23,
      "transform": "rotate(-40 512 512)"
    },
    {
      "d": "M430 588L512 700L594 588",
      "width": 23,
      "transform": "rotate(-40 512 512)"
    },
    {
      "d": "M446 236H578A16 16 0 0 1 594 252V266A16 16 0 0 1 578 282H446A16 16 0 0 1 430 266V252A16 16 0 0 1 446 236Z",
      "fill": true,
      "transform": "rotate(-40 512 512)"
    },
    {
      "d": "M430 300H594",
      "width": 20,
      "transform": "rotate(-40 512 512)"
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(722 690) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(722 690) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(302 272) rotate(148)"
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
      "rotate": -2.4
    },
    "accent": {
      "x": 12,
      "y": -6
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
