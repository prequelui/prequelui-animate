<script module>
  export const definition = {
  "slug": "teddy",
  "name": "Teddy bear",
  "group": "Kids",
  "theme": "candy",
  "keywords": [
    "teddy",
    "bear",
    "toy",
    "kids",
    "child"
  ],
  "description": "A round teddy head with two ears, a soft muzzle and a tiny stitched smile.",
  "motion": "bounce",
  "ink": [
    {
      "d": "M320 512A192 192 0 1 0 704 512A192 192 0 1 0 320 512Z",
      "width": 23
    },
    {
      "d": "M296 352A72 72 0 1 0 440 352A72 72 0 1 0 296 352Z",
      "width": 23
    },
    {
      "d": "M584 352A72 72 0 1 0 728 352A72 72 0 1 0 584 352Z",
      "width": 23
    },
    {
      "d": "M334 352A34 34 0 1 0 402 352A34 34 0 1 0 334 352Z",
      "width": 18
    },
    {
      "d": "M622 352A34 34 0 1 0 690 352A34 34 0 1 0 622 352Z",
      "width": 18
    },
    {
      "d": "M420 576A92 70 0 1 0 604 576A92 70 0 1 0 420 576Z",
      "width": 20
    },
    {
      "d": "M436 480A14 14 0 1 0 464 480A14 14 0 1 0 436 480Z",
      "fill": true
    },
    {
      "d": "M560 480A14 14 0 1 0 588 480A14 14 0 1 0 560 480Z",
      "fill": true
    },
    {
      "d": "M486 548A26 18 0 1 0 538 548A26 18 0 1 0 486 548Z",
      "fill": true
    },
    {
      "d": "M512 566V594",
      "width": 16
    },
    {
      "d": "M512 594Q486 618 464 600",
      "width": 16
    },
    {
      "d": "M512 594Q538 618 560 600",
      "width": 16
    }
  ],
  "accent": [
    {
      "d": "M-15 -98.87A100 100 0 1 0 -15 98.87Z",
      "transform": "translate(756 486) rotate(0)"
    },
    {
      "d": "M15 -98.87A100 100 0 0 1 15 98.87Z",
      "transform": "translate(756 486) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(260 300) rotate(150)"
    }
  ],
  "palette": {
    "light": [
      "#ff6ca8",
      "#ffc24a"
    ],
    "dark": [
      "#ff8cc0",
      "#ffd06a"
    ]
  },
  "motionConfig": {
    "main": {
      "y": -12
    },
    "accent": {
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
