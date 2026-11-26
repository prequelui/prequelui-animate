<script module>
  export const definition = {
  "slug": "perfume",
  "name": "Perfume",
  "group": "Beauty",
  "theme": "rose",
  "keywords": [
    "perfume",
    "fragrance",
    "bottle",
    "beauty",
    "scent"
  ],
  "description": "A flacon with a squared cap and an atomizer, throwing three fine comets of scent.",
  "motion": "spray",
  "ink": [
    {
      "d": "M382 440H642A52 52 0 0 1 694 492V718A52 52 0 0 1 642 770H382A52 52 0 0 1 330 718V492A52 52 0 0 1 382 440Z",
      "width": 23
    },
    {
      "d": "M466 380H558A14 14 0 0 1 572 394V426A14 14 0 0 1 558 440H466A14 14 0 0 1 452 426V394A14 14 0 0 1 466 380Z",
      "width": 23
    },
    {
      "d": "M452 292H572A22 22 0 0 1 594 314V366A22 22 0 0 1 572 388H452A22 22 0 0 1 430 366V314A22 22 0 0 1 452 292Z",
      "width": 23
    },
    {
      "d": "M602 320H648A8 8 0 0 1 656 328V338A8 8 0 0 1 648 346H602A8 8 0 0 1 594 338V328A8 8 0 0 1 602 320Z",
      "width": 23
    },
    {
      "d": "M348 604H676",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(700 540) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(700 540) rotate(0)"
    },
    {
      "d": "M100 0C55 -13 13 -13 0 -13A13 13 0 0 0 0 13C13 13 55 13 100 0Z",
      "transform": "translate(676 308) rotate(-22)"
    },
    {
      "d": "M126 0C69.3 -15 15 -15 0 -15A15 15 0 0 0 0 15C15 15 69.3 15 126 0Z",
      "transform": "translate(700 340) rotate(-8)"
    },
    {
      "d": "M90 0C49.5 -12 12 -12 0 -12A12 12 0 0 0 0 12C12 12 49.5 12 90 0Z",
      "transform": "translate(676 374) rotate(8)"
    }
  ],
  "palette": {
    "light": [
      "#ff7ca8",
      "#ff9a5c"
    ],
    "dark": [
      "#ff9ac0",
      "#ffb07c"
    ]
  },
  "motionConfig": {
    "main": {},
    "accent": {
      "x": 18,
      "y": -14,
      "scale": 1.06
    }
  }
};
</script>

<script>
  import CategoryPictogram from "./category-core.svelte";
  let { ...rest } = $props();
</script>

<CategoryPictogram definition={definition} {...rest} />
