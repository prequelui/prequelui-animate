import { createPrequelMountainIcon } from "./prequel-mountain.js";

export function createPrequelMountainDuotoneIcon(root, options = {}) {
  const controller = createPrequelMountainIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
