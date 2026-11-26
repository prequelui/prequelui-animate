<script module>
  export const definition = {
  "slug": "price-tag",
  "name": "Price tag",
  "group": "Commerce",
  "theme": "orange",
  "keywords": [
    "tag",
    "price",
    "label",
    "sale"
  ],
  "description": "A tag pointing right, with a punched hole and two comets leaving the tip.",
  "motion": "comet",
  "ink": [
    {
      "d": "M340 290H592Q608 290 620 302L768 450Q780 462 768 474L620 622Q608 634 592 634H340Q300 634 300 594V330Q300 290 340 290Z",
      "width": 23
    },
    {
      "d": "M358 462A42 42 0 1 0 442 462A42 42 0 1 0 358 462Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -102.91A104 104 0 1 0 -15 102.91Z",
      "transform": "translate(686 500) rotate(20)"
    },
    {
      "d": "M15 -102.91A104 104 0 0 1 15 102.91Z",
      "transform": "translate(686 500) rotate(20)"
    },
    {
      "d": "M118 0C64.9 -19 19 -19 0 -19A19 19 0 0 0 0 19C19 19 64.9 19 118 0Z",
      "transform": "translate(770 610) rotate(34)"
    },
    {
      "d": "M86 0C47.3 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 47.3 15 86 0Z",
      "transform": "translate(812 560) rotate(30)"
    }
  ],
  "palette": {
    "light": [
      "#ff7a5c",
      "#ff5ca8"
    ],
    "dark": [
      "#ff9a7c",
      "#ff7cc0"
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
