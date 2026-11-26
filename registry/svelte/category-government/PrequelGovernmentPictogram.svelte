<script module>
  export const definition = {
  "slug": "government",
  "name": "Government",
  "group": "Administration",
  "theme": "slate",
  "keywords": [
    "government",
    "admin",
    "public",
    "civic",
    "institution"
  ],
  "description": "A civic building with a pediment, four columns and a flag above the roof.",
  "motion": "float",
  "ink": [
    {
      "d": "M244 362L512 226L780 362Z",
      "width": 23
    },
    {
      "d": "M280 362H744A12 12 0 0 1 756 374V394A12 12 0 0 1 744 406H280A12 12 0 0 1 268 394V374A12 12 0 0 1 280 362Z",
      "width": 23
    },
    {
      "d": "M310 406H342A10 10 0 0 1 352 416V656A10 10 0 0 1 342 666H310A10 10 0 0 1 300 656V416A10 10 0 0 1 310 406Z",
      "width": 20
    },
    {
      "d": "M430 406H462A10 10 0 0 1 472 416V656A10 10 0 0 1 462 666H430A10 10 0 0 1 420 656V416A10 10 0 0 1 430 406Z",
      "width": 20
    },
    {
      "d": "M570 406H602A10 10 0 0 1 612 416V656A10 10 0 0 1 602 666H570A10 10 0 0 1 560 656V416A10 10 0 0 1 570 406Z",
      "width": 20
    },
    {
      "d": "M690 406H722A10 10 0 0 1 732 416V656A10 10 0 0 1 722 666H690A10 10 0 0 1 680 656V416A10 10 0 0 1 690 406Z",
      "width": 20
    },
    {
      "d": "M272 666H752A12 12 0 0 1 764 678V694A12 12 0 0 1 752 706H272A12 12 0 0 1 260 694V678A12 12 0 0 1 272 666Z",
      "width": 23
    },
    {
      "d": "M240 706H784A10 10 0 0 1 794 716V726A10 10 0 0 1 784 736H240A10 10 0 0 1 230 726V716A10 10 0 0 1 240 706Z",
      "width": 20
    },
    {
      "d": "M512 226V142",
      "width": 18
    },
    {
      "d": "M512 142H650V220H512",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-16 -114.89A116 116 0 1 0 -16 114.89Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M16 -114.89A116 116 0 0 1 16 114.89Z",
      "transform": "translate(512 520) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(790 300) rotate(-30)"
    }
  ],
  "palette": {
    "light": [
      "#7a8ba8",
      "#b06cff"
    ],
    "dark": [
      "#96a6c4",
      "#c58cff"
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
