<script module>
  export const definition = {
  "slug": "paw",
  "name": "Paw",
  "group": "Animals",
  "theme": "forest",
  "keywords": [
    "paw",
    "pet",
    "animal",
    "dog",
    "cat"
  ],
  "description": "A broad paw pad with four toe pads, resting in front of a wide split orb.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M512 800C380 800 318 720 318 650C318 578 400 538 512 538C624 538 706 578 706 650C706 720 644 800 512 800Z",
      "width": 23
    },
    {
      "d": "M288 448A68 88 0 1 0 424 448A68 88 0 1 0 288 448Z",
      "width": 23
    },
    {
      "d": "M374 366A70 92 0 1 0 514 366A70 92 0 1 0 374 366Z",
      "width": 23
    },
    {
      "d": "M510 366A70 92 0 1 0 650 366A70 92 0 1 0 510 366Z",
      "width": 23
    },
    {
      "d": "M600 448A68 88 0 1 0 736 448A68 88 0 1 0 600 448Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-16 -129.01A130 130 0 1 0 -16 129.01Z",
      "transform": "translate(512 650) rotate(0)"
    },
    {
      "d": "M16 -129.01A130 130 0 0 1 16 129.01Z",
      "transform": "translate(512 650) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#38d4b0",
      "#a8d94a"
    ],
    "dark": [
      "#6fe6c8",
      "#c0e87a"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "scale": 1.08
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
