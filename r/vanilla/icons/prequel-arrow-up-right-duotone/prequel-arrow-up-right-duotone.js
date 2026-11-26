import { createPrequelArrowUpRightIcon } from "./prequel-arrow-up-right.js";

export function createPrequelArrowUpRightDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowUpRightIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
