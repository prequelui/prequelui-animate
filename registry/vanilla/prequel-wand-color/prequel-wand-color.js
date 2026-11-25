import { createPrequelWandIcon } from "./prequel-wand.js";

export function createPrequelWandColorIcon(root, options = {}) {
  const controller = createPrequelWandIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
