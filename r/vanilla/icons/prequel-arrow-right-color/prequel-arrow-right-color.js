import { createPrequelArrowRightIcon } from "./prequel-arrow-right.js";

export function createPrequelArrowRightColorIcon(root, options = {}) {
  const controller = createPrequelArrowRightIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
