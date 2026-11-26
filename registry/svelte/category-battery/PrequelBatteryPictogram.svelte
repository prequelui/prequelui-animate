<script module>
  export const definition = {
  "slug": "battery",
  "name": "Battery",
  "group": "Energy",
  "theme": "volt",
  "keywords": [
    "battery",
    "energy",
    "charge",
    "power",
    "cell"
  ],
  "description": "A wide battery with a terminal and a lightning bolt cut through its face.",
  "motion": "pulse",
  "ink": [
    {
      "d": "M284 360H666A34 34 0 0 1 700 394V626A34 34 0 0 1 666 660H284A34 34 0 0 1 250 626V394A34 34 0 0 1 284 360Z",
      "width": 23
    },
    {
      "d": "M716 450H764A16 16 0 0 1 780 466V554A16 16 0 0 1 764 570H716A16 16 0 0 1 700 554V466A16 16 0 0 1 716 450Z",
      "width": 23
    },
    {
      "d": "M520 408L430 532H510L468 618L600 486H518L558 408Z",
      "width": 20
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(250 510) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(250 510) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(780 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#a8d94a",
      "#58c8ff"
    ],
    "dark": [
      "#c0e87a",
      "#7cd6ff"
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
