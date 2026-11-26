import { createPrequelArrowUpIcon } from "./prequel-arrow-up.js";

export function createPrequelArrowUpColorIcon(root, options = {}) {
  const controller = createPrequelArrowUpIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
