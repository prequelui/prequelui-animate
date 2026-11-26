import { createPrequelChartPieIcon } from "./prequel-chart-pie.js";

export function createPrequelChartPieColorIcon(root, options = {}) {
  const controller = createPrequelChartPieIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
