import { createPrequelRainbowIcon } from "./prequel-rainbow.js";

export function createPrequelRainbowDuotoneIcon(root, options = {}) {
  const controller = createPrequelRainbowIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
