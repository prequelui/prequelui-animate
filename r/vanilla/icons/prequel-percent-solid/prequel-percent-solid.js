import { createPrequelPercentIcon } from "./prequel-percent.js";

export function createPrequelPercentSolidIcon(root, options = {}) {
  const controller = createPrequelPercentIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
