import { createPrequelChipIcon } from "./prequel-chip.js";

export function createPrequelChipSolidIcon(root, options = {}) {
  const controller = createPrequelChipIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
