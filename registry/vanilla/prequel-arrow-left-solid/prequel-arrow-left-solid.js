import { createPrequelArrowLeftIcon } from "./prequel-arrow-left.js";

export function createPrequelArrowLeftSolidIcon(root, options = {}) {
  const controller = createPrequelArrowLeftIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
