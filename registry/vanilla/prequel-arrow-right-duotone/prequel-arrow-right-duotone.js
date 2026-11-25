import { createPrequelArrowRightIcon } from "./prequel-arrow-right.js";

export function createPrequelArrowRightDuotoneIcon(root, options = {}) {
  const controller = createPrequelArrowRightIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
