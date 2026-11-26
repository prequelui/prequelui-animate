<script module>
  export const definition = {
  "slug": "house",
  "name": "Home",
  "group": "Home",
  "theme": "orange",
  "keywords": [
    "house",
    "home",
    "building",
    "roof"
  ],
  "description": "A house with a pitched roof, a door and a round window, in front of a split orb.",
  "motion": "float",
  "ink": [
    {
      "d": "M220 486L512 238L804 486",
      "width": 23
    },
    {
      "d": "M282 452V760H742V452",
      "width": 23
    },
    {
      "d": "M462 580H562A10 10 0 0 1 572 590V750A10 10 0 0 1 562 760H462A10 10 0 0 1 452 750V590A10 10 0 0 1 462 580Z",
      "width": 23
    },
    {
      "d": "M578 566A42 42 0 1 0 662 566A42 42 0 1 0 578 566Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-14 -99.02A100 100 0 1 0 -14 99.02Z",
      "transform": "translate(700 470) rotate(0)"
    },
    {
      "d": "M14 -99.02A100 100 0 0 1 14 99.02Z",
      "transform": "translate(700 470) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
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
