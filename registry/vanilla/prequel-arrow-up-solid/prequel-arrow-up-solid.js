import { createPrequelArrowUpIcon } from "./prequel-arrow-up.js";

export function createPrequelArrowUpSolidIcon(root, options = {}) {
  const controller = createPrequelArrowUpIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
