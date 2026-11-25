import { createPrequelArrowDownIcon } from "./prequel-arrow-down.js";

export function createPrequelArrowDownDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowDownIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
