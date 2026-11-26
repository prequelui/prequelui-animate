<script module>
  export const definition = {
  "slug": "steering-wheel",
  "name": "Steering wheel",
  "group": "Auto",
  "theme": "steel",
  "keywords": [
    "steering",
    "wheel",
    "drive",
    "car",
    "control"
  ],
  "description": "A steering wheel with a double rim, a round hub and three spokes around a split orb.",
  "motion": "spin",
  "ink": [
    {
      "d": "M226 512A286 286 0 1 0 798 512A286 286 0 1 0 226 512Z",
      "width": 23
    },
    {
      "d": "M286 512A226 226 0 1 0 738 512A226 226 0 1 0 286 512Z",
      "width": 23
    },
    {
      "d": "M430 520A82 82 0 1 0 594 520A82 82 0 1 0 430 520Z",
      "width": 23
    },
    {
      "d": "M512 294V438",
      "width": 20
    },
    {
      "d": "M324 610L462 552",
      "width": 20
    },
    {
      "d": "M700 610L562 552",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-16 -129.01A130 130 0 1 0 -16 129.01Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M16 -129.01A130 130 0 0 1 16 129.01Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 320) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#7a8ba8",
      "#4aa8ff"
    ],
    "dark": [
      "#96a6c4",
      "#74baff"
    ]
  },
  "motionConfig": {
    "main": {
      "rotate": 10
    },
    "accent": {
      "x": 10
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
