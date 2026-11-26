<script module>
  export const definition = {
  "slug": "museum",
  "name": "Museum",
  "group": "Culture",
  "theme": "plum",
  "keywords": [
    "museum",
    "culture",
    "gallery",
    "art",
    "history"
  ],
  "description": "A classical museum front with a pediment, four columns and a wide flight of steps.",
  "motion": "float",
  "ink": [
    {
      "d": "M230 382L512 232L794 382Z",
      "width": 23
    },
    {
      "d": "M264 382H760A12 12 0 0 1 772 394V418A12 12 0 0 1 760 430H264A12 12 0 0 1 252 418V394A12 12 0 0 1 264 382Z",
      "width": 23
    },
    {
      "d": "M298 430H334A12 12 0 0 1 346 442V688A12 12 0 0 1 334 700H298A12 12 0 0 1 286 688V442A12 12 0 0 1 298 430Z",
      "width": 20
    },
    {
      "d": "M434 430H470A12 12 0 0 1 482 442V688A12 12 0 0 1 470 700H434A12 12 0 0 1 422 688V442A12 12 0 0 1 434 430Z",
      "width": 20
    },
    {
      "d": "M570 430H606A12 12 0 0 1 618 442V688A12 12 0 0 1 606 700H570A12 12 0 0 1 558 688V442A12 12 0 0 1 570 430Z",
      "width": 20
    },
    {
      "d": "M706 430H742A12 12 0 0 1 754 442V688A12 12 0 0 1 742 700H706A12 12 0 0 1 694 688V442A12 12 0 0 1 706 430Z",
      "width": 20
    },
    {
      "d": "M262 700H762A12 12 0 0 1 774 712V732A12 12 0 0 1 762 744H262A12 12 0 0 1 250 732V712A12 12 0 0 1 262 700Z",
      "width": 23
    },
    {
      "d": "M230 744H794A10 10 0 0 1 804 754V764A10 10 0 0 1 794 774H230A10 10 0 0 1 220 764V754A10 10 0 0 1 230 744Z",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-16 -118.93A120 120 0 1 0 -16 118.93Z",
      "transform": "translate(512 560) rotate(0)"
    },
    {
      "d": "M16 -118.93A120 120 0 0 1 16 118.93Z",
      "transform": "translate(512 560) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 300) rotate(-30)"
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
