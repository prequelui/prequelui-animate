import { createPrequelSearchIcon } from "./prequel-search.js";

export function createPrequelSearchColorIcon(root, options = {}) {
  const controller = createPrequelSearchIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
