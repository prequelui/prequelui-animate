import { createPrequelArrowUpRightIcon } from "./prequel-arrow-up-right.js";

export function createPrequelArrowUpRightColorIcon(root, options = {}) {
  const controller = createPrequelArrowUpRightIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
