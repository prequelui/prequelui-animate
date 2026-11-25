import { createPrequelMountainIcon } from "./prequel-mountain.js";

export function createPrequelMountainColorIcon(root, options = {}) {
  const controller = createPrequelMountainIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
