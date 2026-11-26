import { createPrequelRefreshIcon } from "./prequel-refresh.js";

export function createPrequelRefreshDuotoneIcon(root, options = {}) {
  const controller = createPrequelRefreshIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
