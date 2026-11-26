<script module>
  export const definition = {
  "slug": "layers",
  "name": "Layers",
  "group": "Design",
  "theme": "pink",
  "keywords": [
    "layers",
    "stack",
    "order",
    "design"
  ],
  "description": "Three stacked plates, with an orb inside the top plate and a comet above.",
  "motion": "float",
  "ink": [
    {
      "d": "M512 268L808 398L512 528L216 398Z",
      "width": 23
    },
    {
      "d": "M216 520L512 650L808 520",
      "width": 23
    },
    {
      "d": "M216 640L512 770L808 640",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-17 -128.88A130 130 0 1 0 -17 128.88Z",
      "transform": "translate(512 398) rotate(0)"
    },
    {
      "d": "M17 -128.88A130 130 0 0 1 17 128.88Z",
      "transform": "translate(512 398) rotate(0)"
    },
    {
      "d": "M100 0C55 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 55 15 100 0Z",
      "transform": "translate(700 260) rotate(-22)"
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
    "main": {
      "y": -10
    },
    "accent": {
      "y": -14
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
