<script module>
  export const definition = {
  "slug": "clinic",
  "name": "Clinic",
  "group": "Health",
  "theme": "red",
  "keywords": [
    "cross",
    "clinic",
    "medical",
    "hospital"
  ],
  "description": "An outlined medical cross with a split orb visible through its arms.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M466 236H558V466H788V558H558V788H466V558H236V466H466Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-20 -148.66A150 150 0 1 0 -20 148.66Z",
      "transform": "translate(512 512) rotate(45)"
    },
    {
      "d": "M20 -148.66A150 150 0 0 1 20 148.66Z",
      "transform": "translate(512 512) rotate(45)"
    }
  ],
  "palette": {
    "light": [
      "#ff6a6a",
      "#ff9a5c"
    ],
    "dark": [
      "#ff8a8a",
      "#ffb07c"
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
