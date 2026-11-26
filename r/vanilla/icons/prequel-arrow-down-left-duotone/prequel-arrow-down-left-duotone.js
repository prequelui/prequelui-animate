import { createPrequelArrowDownLeftIcon } from "./prequel-arrow-down-left.js";

export function createPrequelArrowDownLeftDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowDownLeftIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
