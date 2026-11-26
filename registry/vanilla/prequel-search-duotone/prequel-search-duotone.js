import { createPrequelSearchIcon } from "./prequel-search.js";

export function createPrequelSearchDuotoneIcon(root, options = {}) {
  const controller = createPrequelSearchIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
