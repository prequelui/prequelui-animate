import { createPrequelChartPieIcon } from "./prequel-chart-pie.js";

export function createPrequelChartPieSolidIcon(root, options = {}) {
  const controller = createPrequelChartPieIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
