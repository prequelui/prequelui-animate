import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "speakerphone",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 8a3 3 0 0 1 0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "tabler-speakerphone",
  "family": "tabler",
  "name": "speakerphone",
  "category": "Communication",
  "motion": "shake",
  "component": "createTablerSpeakerphoneIcon"
};

export function createTablerSpeakerphoneIcon(root, options = {}) {
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
