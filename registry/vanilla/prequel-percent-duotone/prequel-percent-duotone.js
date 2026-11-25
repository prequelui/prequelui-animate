import { createPrequelPercentIcon } from "./prequel-percent.js";

export function createPrequelPercentDuotoneIcon(root, options = {}) {
  const controller = createPrequelPercentIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
