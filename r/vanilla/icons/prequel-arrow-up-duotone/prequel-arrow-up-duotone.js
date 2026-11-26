import { createPrequelArrowUpIcon } from "./prequel-arrow-up.js";

export function createPrequelArrowUpDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowUpIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
