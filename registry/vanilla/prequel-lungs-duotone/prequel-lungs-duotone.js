import { createPrequelLungsIcon } from "./prequel-lungs.js";

export function createPrequelLungsDuotoneIcon(root, options = {}) {
  const controller = createPrequelLungsIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
