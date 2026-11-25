import { createPrequelChipIcon } from "./prequel-chip.js";

export function createPrequelChipColorIcon(root, options = {}) {
  const controller = createPrequelChipIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
