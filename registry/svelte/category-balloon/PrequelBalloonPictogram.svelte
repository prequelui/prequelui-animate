<script module>
  export const definition = {
  "slug": "balloon",
  "name": "Balloon",
  "group": "Kids",
  "theme": "candy",
  "keywords": [
    "balloon",
    "party",
    "kids",
    "birthday",
    "celebration"
  ],
  "description": "A tall balloon with a knotted neck, a curling string and a bright highlight.",
  "motion": "swing",
  "ink": [
    {
      "d": "M512 216C664 216 766 318 766 452C766 584 646 656 512 676C378 656 258 584 258 452C258 318 360 216 512 216Z",
      "width": 23
    },
    {
      "d": "M484 676H540L512 716Z",
      "fill": true
    },
    {
      "d": "M512 716C470 756 552 786 512 824",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M392 348A30 52 0 1 0 452 348A30 52 0 1 0 392 348Z"
    },
    {
      "d": "M-14 -88.9A90 90 0 1 0 -14 88.9Z",
      "transform": "translate(768 470) rotate(0)"
    },
    {
      "d": "M14 -88.9A90 90 0 0 1 14 88.9Z",
      "transform": "translate(768 470) rotate(0)"
    },
    {
      "d": "M84 0C46.2 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 46.2 13 84 0Z",
      "transform": "translate(286 282) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#ff6ca8",
      "#ffc24a"
    ],
    "dark": [
      "#ff8cc0",
      "#ffd06a"
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
