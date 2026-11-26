<script module>
  export const definition = {
  "slug": "dress",
  "name": "Dress",
  "group": "Fashion",
  "theme": "berry",
  "keywords": [
    "dress",
    "fashion",
    "clothing",
    "hanger",
    "boutique"
  ],
  "description": "A hanger with a hooked neck holding a fitted dress that widens into a soft hem.",
  "motion": "swing",
  "ink": [
    {
      "d": "M512 236C542 236 556 258 542 278C532 292 512 296 512 314",
      "width": 23
    },
    {
      "d": "M512 314L344 428H680Z",
      "width": 23
    },
    {
      "d": "M436 428H588L640 520L612 790H412L384 520Z",
      "width": 23
    },
    {
      "d": "M412 560H612",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(742 606) rotate(10)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(742 606) rotate(10)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(278 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#ff5c8a",
      "#c06cff"
    ],
    "dark": [
      "#ff7ca4",
      "#d08cff"
    ]
  },
  "motionConfig": {
    "main": {
      "rotate": -3
    },
    "accent": {
      "y": -8
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
