import { createPrequelChartBarIcon } from "./prequel-chart-bar.js";

export function createPrequelChartBarSolidIcon(root, options = {}) {
  const controller = createPrequelChartBarIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
