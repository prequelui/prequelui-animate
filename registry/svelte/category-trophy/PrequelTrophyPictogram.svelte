<script module>
  export const definition = {
  "slug": "trophy",
  "name": "Trophy",
  "group": "Sport",
  "theme": "lime",
  "keywords": [
    "trophy",
    "win",
    "award",
    "cup"
  ],
  "description": "A cup with two handles, a stem and a foot, plus an orb behind the rim.",
  "motion": "bounce",
  "ink": [
    {
      "d": "M384 260H640V414C640 512 592 570 512 570C432 570 384 512 384 414Z",
      "width": 23
    },
    {
      "d": "M384 320H312C272 320 262 372 296 402C322 426 356 432 386 430",
      "width": 23
    },
    {
      "d": "M640 320H712C752 320 762 372 728 402C702 426 668 432 638 430",
      "width": 23
    },
    {
      "d": "M512 570V674",
      "width": 24
    },
    {
      "d": "M414 674H610A22 22 0 0 1 632 696V716A22 22 0 0 1 610 738H414A22 22 0 0 1 392 716V696A22 22 0 0 1 414 674Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-13 -95.12A96 96 0 1 0 -13 95.12Z",
      "transform": "translate(748 340) rotate(0)"
    },
    {
      "d": "M13 -95.12A96 96 0 0 1 13 95.12Z",
      "transform": "translate(748 340) rotate(0)"
    },
    {
      "d": "M108 0C59.4 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 59.4 17 108 0Z",
      "transform": "translate(280 300) rotate(148)"
    }
  ],
  "palette": {
    "light": [
      "#a8d94a",
      "#38d4b0"
    ],
    "dark": [
      "#c0e87a",
      "#6fe6c8"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -12
    },
    "accent": {
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
