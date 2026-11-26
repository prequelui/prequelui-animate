import { createPrequelArrowUpRightIcon } from "./prequel-arrow-up-right.js";

export function createPrequelArrowUpRightSolidIcon(root, options = {}) {
  const controller = createPrequelArrowUpRightIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
