import { createPrequelArrowLeftIcon } from "./prequel-arrow-left.js";

export function createPrequelArrowLeftDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowLeftIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
