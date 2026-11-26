import { createPrequelArrowDownLeftIcon } from "./prequel-arrow-down-left.js";

export function createPrequelArrowDownLeftColorIcon(root, options = {}) {
  const controller = createPrequelArrowDownLeftIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
