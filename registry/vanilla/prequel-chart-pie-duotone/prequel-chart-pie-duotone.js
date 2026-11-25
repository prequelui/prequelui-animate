import { createPrequelChartPieIcon } from "./prequel-chart-pie.js";

export function createPrequelChartPieDuotoneIcon(root, options = {}) {
  const controller = createPrequelChartPieIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
