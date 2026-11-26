<script module>
  export const definition = {
  "slug": "car",
  "name": "Car",
  "group": "Auto",
  "theme": "steel",
  "keywords": [
    "car",
    "auto",
    "vehicle",
    "drive",
    "mobility"
  ],
  "description": "A compact car in profile with two wheels, glazed windows and a comet trailing the exhaust.",
  "motion": "drive",
  "ink": [
    {
      "d": "M214 604H286L356 474H606L676 552H810V660C810 688 788 710 760 710H264C236 710 214 688 214 660Z",
      "width": 23
    },
    {
      "d": "M390 492H486V548H344Z",
      "width": 20
    },
    {
      "d": "M514 492H594L640 548H514Z",
      "width": 20
    },
    {
      "d": "M270 710A70 70 0 1 0 410 710A70 70 0 1 0 270 710Z",
      "width": 23
    },
    {
      "d": "M630 710A70 70 0 1 0 770 710A70 70 0 1 0 630 710Z",
      "width": 23
    },
    {
      "d": "M310 710A30 30 0 1 0 370 710A30 30 0 1 0 310 710Z",
      "width": 20
    },
    {
      "d": "M670 710A30 30 0 1 0 730 710A30 30 0 1 0 670 710Z",
      "width": 20
    },
    {
      "d": "M766 584H794A8 8 0 0 1 802 592V594A8 8 0 0 1 794 602H766A8 8 0 0 1 758 594V592A8 8 0 0 1 766 584Z",
      "fill": true
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(806 486) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(806 486) rotate(0)"
    },
    {
      "d": "M104 0C57.2 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 57.2 15 104 0Z",
      "transform": "translate(184 650) rotate(168)"
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
      "x": 8
    },
    "accent": {
      "x": -12,
      "y": -8
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
