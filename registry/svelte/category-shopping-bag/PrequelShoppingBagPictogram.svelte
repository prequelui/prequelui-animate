<script module>
  export const definition = {
  "slug": "shopping-bag",
  "name": "Shopping bag",
  "group": "Commerce",
  "theme": "orange",
  "keywords": [
    "bag",
    "buy",
    "purchase",
    "carry"
  ],
  "description": "A soft-cornered bag with a rounded handle and a split orb at its right edge.",
  "motion": "orb",
  "ink": [
    {
      "d": "M362 356H662A32 32 0 0 1 694 388V748A32 32 0 0 1 662 780H362A32 32 0 0 1 330 748V388A32 32 0 0 1 362 356Z",
      "width": 23
    },
    {
      "d": "M404 356V330Q404 238 512 238Q620 238 620 330V356",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -110.99A112 112 0 1 0 -15 110.99Z",
      "transform": "translate(706 520) rotate(-10)"
    },
    {
      "d": "M15 -110.99A112 112 0 0 1 15 110.99Z",
      "transform": "translate(706 520) rotate(-10)"
    }
  ],
  "palette": {
    "light": [
      "#ff7a5c",
      "#ff5ca8"
    ],
    "dark": [
      "#ff9a7c",
      "#ff7cc0"
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

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
