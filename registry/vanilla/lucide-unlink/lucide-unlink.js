import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "unlink",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8",
        "x2": "8",
        "y1": "2",
        "y2": "5"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "2",
        "x2": "5",
        "y1": "8",
        "y2": "8"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "16",
        "x2": "16",
        "y1": "19",
        "y2": "22"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "19",
        "x2": "22",
        "y1": "16",
        "y2": "16"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5
  ]
};

export const meta = {
  "slug": "lucide-unlink",
  "family": "lucide",
  "name": "unlink",
  "category": "Communication",
  "motion": "orbit",
  "component": "createLucideUnlinkIcon"
};

export function createLucideUnlinkIcon(root, options = {}) {
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
