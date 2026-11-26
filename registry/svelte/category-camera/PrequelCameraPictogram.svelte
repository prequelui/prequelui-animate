<script module>
  export const definition = {
  "slug": "camera",
  "name": "Camera",
  "group": "Devices",
  "theme": "primary",
  "keywords": [
    "photo",
    "picture",
    "lens",
    "shoot"
  ],
  "description": "A camera body with a viewfinder hump, a lens ring and a split orb on the shutter side.",
  "motion": "orb",
  "ink": [
    {
      "d": "M260 338H764A64 64 0 0 1 828 402V690A64 64 0 0 1 764 754H260A64 64 0 0 1 196 690V402A64 64 0 0 1 260 338Z",
      "width": 23
    },
    {
      "d": "M392 338V310Q392 282 420 282H604Q632 282 632 310V338",
      "width": 23
    },
    {
      "d": "M380 546A132 132 0 1 0 644 546A132 132 0 1 0 380 546Z",
      "width": 23
    },
    {
      "d": "M282 392H322A8 8 0 0 1 330 400V414A8 8 0 0 1 322 422H282A8 8 0 0 1 274 414V400A8 8 0 0 1 282 392Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-15 -106.95A108 108 0 1 0 -15 106.95Z",
      "transform": "translate(752 512) rotate(15)"
    },
    {
      "d": "M15 -106.95A108 108 0 0 1 15 106.95Z",
      "transform": "translate(752 512) rotate(15)"
    },
    {
      "d": "M118 0C64.9 -20 20 -20 0 -20A20 20 0 0 0 0 20C20 20 64.9 20 118 0Z",
      "transform": "translate(704 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#5b6cff",
      "#b06cff"
    ],
    "dark": [
      "#7c8bff",
      "#c58cff"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 16,
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
