<script module>
  export const definition = {
  "slug": "fuel",
  "name": "Fuel pump",
  "group": "Auto",
  "theme": "steel",
  "keywords": [
    "fuel",
    "petrol",
    "station",
    "pump",
    "gas"
  ],
  "description": "A fuel pump with a display panel, a looping hose and a nozzle resting in its cradle.",
  "motion": "orb",
  "ink": [
    {
      "d": "M300 300H560A30 30 0 0 1 590 330V740A30 30 0 0 1 560 770H300A30 30 0 0 1 270 740V330A30 30 0 0 1 300 300Z",
      "width": 23
    },
    {
      "d": "M326 350H534A16 16 0 0 1 550 366V474A16 16 0 0 1 534 490H326A16 16 0 0 1 310 474V366A16 16 0 0 1 326 350Z",
      "width": 23
    },
    {
      "d": "M242 748H618A12 12 0 0 1 630 760V780A12 12 0 0 1 618 792H242A12 12 0 0 1 230 780V760A12 12 0 0 1 242 748Z",
      "width": 23
    },
    {
      "d": "M590 430C692 430 720 500 700 566C686 614 654 626 632 602",
      "width": 23
    },
    {
      "d": "M710 548H778A14 14 0 0 1 792 562V580A14 14 0 0 1 778 594H710A14 14 0 0 1 696 580V562A14 14 0 0 1 710 548Z",
      "width": 23
    },
    {
      "d": "M792 560H838",
      "width": 18
    }
  ],
  "accent": [
    {
      "d": "M-15 -94.82A96 96 0 1 0 -15 94.82Z",
      "transform": "translate(790 330) rotate(0)"
    },
    {
      "d": "M15 -94.82A96 96 0 0 1 15 94.82Z",
      "transform": "translate(790 330) rotate(0)"
    },
    {
      "d": "M90 0C49.5 -14 14 -14 0 -14A14 14 0 0 0 0 14C14 14 49.5 14 90 0Z",
      "transform": "translate(226 330) rotate(150)"
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
