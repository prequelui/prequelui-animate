import { createPrequelWandIcon } from "./prequel-wand.js";

export function createPrequelWandSolidIcon(root, options = {}) {
  const controller = createPrequelWandIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
