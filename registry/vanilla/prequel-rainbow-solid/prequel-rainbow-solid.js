import { createPrequelRainbowIcon } from "./prequel-rainbow.js";

export function createPrequelRainbowSolidIcon(root, options = {}) {
  const controller = createPrequelRainbowIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
