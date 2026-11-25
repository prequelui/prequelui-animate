import { createPrequelArrowRightIcon } from "./prequel-arrow-right.js";

export function createPrequelArrowRightSolidIcon(root, options = {}) {
  const controller = createPrequelArrowRightIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
