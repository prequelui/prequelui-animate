import { createPrequelRainbowIcon } from "./prequel-rainbow.js";

export function createPrequelRainbowColorIcon(root, options = {}) {
  const controller = createPrequelRainbowIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
