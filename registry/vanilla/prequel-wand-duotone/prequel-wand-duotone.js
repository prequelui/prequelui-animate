import { createPrequelWandIcon } from "./prequel-wand.js";

export function createPrequelWandDuotoneIcon(root, options = {}) {
  const controller = createPrequelWandIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
