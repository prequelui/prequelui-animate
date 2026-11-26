<script module>
  export const definition = {
  "slug": "storefront",
  "name": "Storefront",
  "group": "Commerce",
  "theme": "orange",
  "keywords": [
    "shop",
    "store",
    "retail",
    "market"
  ],
  "description": "An awning over a small shop front with a window, a door and an orb behind the wall.",
  "motion": "orb",
  "ink": [
    {
      "d": "M240 286H784A26 26 0 0 1 810 312V380A26 26 0 0 1 784 406H240A26 26 0 0 1 214 380V312A26 26 0 0 1 240 286Z",
      "width": 23
    },
    {
      "d": "M366 286V406",
      "width": 22
    },
    {
      "d": "M512 286V406",
      "width": 22
    },
    {
      "d": "M658 286V406",
      "width": 22
    },
    {
      "d": "M272 406H752A28 28 0 0 1 780 434V708A28 28 0 0 1 752 736H272A28 28 0 0 1 244 708V434A28 28 0 0 1 272 406Z",
      "width": 23
    },
    {
      "d": "M330 470H426A12 12 0 0 1 438 482V568A12 12 0 0 1 426 580H330A12 12 0 0 1 318 568V482A12 12 0 0 1 330 470Z",
      "width": 23
    },
    {
      "d": "M478 540H546A12 12 0 0 1 558 552V724A12 12 0 0 1 546 736H478A12 12 0 0 1 466 724V552A12 12 0 0 1 478 540Z",
      "width": 23
    }
  ],
  "accent": [
    {
      "d": "M-15 -108.97A110 110 0 1 0 -15 108.97Z",
      "transform": "translate(740 474) rotate(0)"
    },
    {
      "d": "M15 -108.97A110 110 0 0 1 15 108.97Z",
      "transform": "translate(740 474) rotate(0)"
    },
    {
      "d": "M104 0C57.2 -17 17 -17 0 -17A17 17 0 0 0 0 17C17 17 57.2 17 104 0Z",
      "transform": "translate(262 320) rotate(148)"
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
