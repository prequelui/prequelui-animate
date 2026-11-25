import { createPrequelArrowLeftIcon } from "./prequel-arrow-left.js";

export function createPrequelArrowLeftColorIcon(root, options = {}) {
  const controller = createPrequelArrowLeftIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
