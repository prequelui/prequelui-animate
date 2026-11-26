<script module>
  export const definition = {
  "slug": "flight",
  "name": "Flight",
  "group": "Travel",
  "theme": "blue",
  "keywords": [
    "plane",
    "flight",
    "travel",
    "trip"
  ],
  "description": "A plane seen from above, trailed by three comets instead of exhaust.",
  "motion": "comet",
  "ink": [
    {
      "d": "M512 214C548 214 562 254 562 314V396L796 520V594L562 520V648L654 706V758L512 716L370 758V706L462 648V520L228 594V520L462 396V314C462 254 476 214 512 214Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M116 0C63.8 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 63.8 17 116 0Z",
      "transform": "translate(420 798) rotate(150)"
    },
    {
      "d": "M86 0C47.3 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 47.3 14 86 0Z",
      "transform": "translate(512 824) rotate(150)"
    },
    {
      "d": "M84 0C46.2 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 46.2 13 84 0Z",
      "transform": "translate(334 780) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#4aa8ff",
      "#7a6cff"
    ],
    "dark": [
      "#74baff",
      "#9a8cff"
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
