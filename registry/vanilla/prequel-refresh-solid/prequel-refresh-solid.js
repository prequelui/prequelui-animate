import { createPrequelRefreshIcon } from "./prequel-refresh.js";

export function createPrequelRefreshSolidIcon(root, options = {}) {
  const controller = createPrequelRefreshIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
