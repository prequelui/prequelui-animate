import { createPrequelArrowDownIcon } from "./prequel-arrow-down.js";

export function createPrequelArrowDownSolidIcon(root, options = {}) {
  const controller = createPrequelArrowDownIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
