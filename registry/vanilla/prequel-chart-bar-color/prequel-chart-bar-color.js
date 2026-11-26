import { createPrequelChartBarIcon } from "./prequel-chart-bar.js";

export function createPrequelChartBarColorIcon(root, options = {}) {
  const controller = createPrequelChartBarIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
