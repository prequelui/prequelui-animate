import { createPrequelWindIcon } from "./prequel-wind.js";

export function createPrequelWindDuotoneIcon(root, options = {}) {
  const controller = createPrequelWindIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
