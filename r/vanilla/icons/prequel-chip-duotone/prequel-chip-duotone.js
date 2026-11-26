import { createPrequelChipIcon } from "./prequel-chip.js";

export function createPrequelChipDuotoneIcon(root, options = {}) {
  const controller = createPrequelChipIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
