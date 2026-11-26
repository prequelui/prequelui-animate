import { createPrequelPillIcon } from "./prequel-pill.js";

export function createPrequelPillDuotoneIcon(root, options = {}) {
  const controller = createPrequelPillIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
