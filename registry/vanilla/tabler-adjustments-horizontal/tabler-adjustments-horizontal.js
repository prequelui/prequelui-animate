import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "adjustments-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6l8 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 6l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12l2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 12l10 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 18l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 18l1 0"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ]
};

export const meta = {
  "slug": "tabler-adjustments-horizontal",
  "family": "tabler",
  "name": "adjustments-horizontal",
  "category": "Interface",
  "motion": "gear",
  "component": "createTablerAdjustmentsHorizontalIcon"
};

export function createTablerAdjustmentsHorizontalIcon(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderSetIcon(definition, current);
  };
  render();
  const controller = bindSetIcon(root, definition, () => current);
  return {
    play: controller.play,
    reset: controller.reset,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
    get observed() {
      return controller.observed;
    },
  };
}
