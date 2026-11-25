import { createPrequelMountainIcon } from "./prequel-mountain.js";

export function createPrequelMountainSolidIcon(root, options = {}) {
  const controller = createPrequelMountainIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
