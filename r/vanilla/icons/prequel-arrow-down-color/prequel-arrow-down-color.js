import { createPrequelArrowDownIcon } from "./prequel-arrow-down.js";

export function createPrequelArrowDownColorIcon(root, options = {}) {
  const controller = createPrequelArrowDownIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
