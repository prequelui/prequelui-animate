import { createPrequelSearchIcon } from "./prequel-search.js";

export function createPrequelSearchSolidIcon(root, options = {}) {
  const controller = createPrequelSearchIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
