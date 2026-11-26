<script module>
  export const definition = {
  "slug": "smartphone",
  "name": "Smartphone",
  "group": "Devices",
  "theme": "primary",
  "keywords": [
    "phone",
    "mobile",
    "handset",
    "device"
  ],
  "description": "A tall handset with a notch, a home mark and a split orb crossing the left bezel.",
  "motion": "orb",
  "ink": [
    {
      "d": "M460 230H564A68 68 0 0 1 632 298V726A68 68 0 0 1 564 794H460A68 68 0 0 1 392 726V298A68 68 0 0 1 460 230Z",
      "width": 23
    },
    {
      "d": "M481 258H543A13 13 0 0 1 556 271V271A13 13 0 0 1 543 284H481A13 13 0 0 1 468 271V271A13 13 0 0 1 481 258Z",
      "fill": true
    },
    {
      "d": "M474 748H550",
      "width": 22
    }
  ],
  "accent": [
    {
      "d": "M-16 -116.91A118 118 0 1 0 -16 116.91Z",
      "transform": "translate(344 512) rotate(0)"
    },
    {
      "d": "M16 -116.91A118 118 0 0 1 16 116.91Z",
      "transform": "translate(344 512) rotate(0)"
    }
  ],
  "palette": {
    "light": [
      "#5b6cff",
      "#b06cff"
    ],
    "dark": [
      "#7c8bff",
      "#c58cff"
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
