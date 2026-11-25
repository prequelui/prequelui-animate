import { createPrequelPercentIcon } from "./prequel-percent.js";

export function createPrequelPercentColorIcon(root, options = {}) {
  const controller = createPrequelPercentIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
