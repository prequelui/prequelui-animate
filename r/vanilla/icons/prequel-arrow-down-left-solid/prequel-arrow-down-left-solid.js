import { createPrequelArrowDownLeftIcon } from "./prequel-arrow-down-left.js";

export function createPrequelArrowDownLeftSolidIcon(root, options = {}) {
  const controller = createPrequelArrowDownLeftIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
