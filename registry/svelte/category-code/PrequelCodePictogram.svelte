<script module>
  export const definition = {
  "slug": "code",
  "name": "Code",
  "group": "Development",
  "theme": "teal",
  "keywords": [
    "code",
    "brackets",
    "developer",
    "program"
  ],
  "description": "Two chevrons and a slash wrapped around a split orb.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M408 342L252 512L408 682",
      "width": 23
    },
    {
      "d": "M616 342L772 512L616 682",
      "width": 23
    },
    {
      "d": "M566 300L458 724",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-20 -148.66A150 150 0 1 0 -20 148.66Z",
      "transform": "translate(512 512) rotate(0)"
    },
    {
      "d": "M20 -148.66A150 150 0 0 1 20 148.66Z",
      "transform": "translate(512 512) rotate(0)"
    }
  ],
  "palette": {
    "light": [
      "#2fd3c0",
      "#46a4ff"
    ],
    "dark": [
      "#5fe6d4",
      "#6cbaff"
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
