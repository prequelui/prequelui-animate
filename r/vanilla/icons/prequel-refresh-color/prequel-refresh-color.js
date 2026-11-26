import { createPrequelRefreshIcon } from "./prequel-refresh.js";

export function createPrequelRefreshColorIcon(root, options = {}) {
  const controller = createPrequelRefreshIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
