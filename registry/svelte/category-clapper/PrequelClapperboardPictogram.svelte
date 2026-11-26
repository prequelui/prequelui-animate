<script module>
  export const definition = {
  "slug": "clapper",
  "name": "Clapperboard",
  "group": "Culture",
  "theme": "plum",
  "keywords": [
    "clapper",
    "film",
    "cinema",
    "culture",
    "movie"
  ],
  "description": "A film clapperboard with a striped top bar, two hinges and a play mark.",
  "motion": "tilt",
  "ink": [
    {
      "d": "M260 432H764A22 22 0 0 1 786 454V742A22 22 0 0 1 764 764H260A22 22 0 0 1 238 742V454A22 22 0 0 1 260 432Z",
      "width": 23
    },
    {
      "d": "M238 432L300 326H848L786 432Z",
      "width": 23
    },
    {
      "d": "M360 326L420 432",
      "width": 18
    },
    {
      "d": "M470 326L530 432",
      "width": 18
    },
    {
      "d": "M580 326L640 432",
      "width": 18
    },
    {
      "d": "M690 326L750 432",
      "width": 18
    },
    {
      "d": "M470 540L620 596L470 652Z",
      "width": 20
    },
    {
      "d": "M286 432A14 14 0 1 0 314 432A14 14 0 1 0 286 432Z",
      "fill": true
    },
    {
      "d": "M710 432A14 14 0 1 0 738 432A14 14 0 1 0 710 432Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(770 600) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(770 600) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(250 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#c06cff",
      "#8a6cff"
    ],
    "dark": [
      "#d08cff",
      "#a48cff"
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
