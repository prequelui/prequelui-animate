<script module>
  export const definition = {
  "slug": "resume",
  "name": "Resume",
  "group": "Jobs",
  "theme": "blue",
  "keywords": [
    "resume",
    "cv",
    "job",
    "hire",
    "profile"
  ],
  "description": "A profile sheet with a portrait, a name block and four ruled sections, plus a comet.",
  "motion": "comet",
  "ink": [
    {
      "d": "M324 220H700A24 24 0 0 1 724 244V780A24 24 0 0 1 700 804H324A24 24 0 0 1 300 780V244A24 24 0 0 1 324 220Z",
      "width": 23
    },
    {
      "d": "M348 336A52 52 0 1 0 452 336A52 52 0 1 0 348 336Z",
      "width": 20
    },
    {
      "d": "M482 310H650",
      "width": 18
    },
    {
      "d": "M482 360H610",
      "width": 18
    },
    {
      "d": "M340 470H684",
      "width": 18
    },
    {
      "d": "M340 520H684",
      "width": 18
    },
    {
      "d": "M340 570H620",
      "width": 18
    },
    {
      "d": "M340 620H660",
      "width": 18
    },
    {
      "d": "M340 670H580",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(780 620) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(780 620) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(240 300) rotate(150)"
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
