import { createPrequelChartLineIcon } from "./prequel-chart-line.js";

export function createPrequelChartLineSolidIcon(root, options = {}) {
  const controller = createPrequelChartLineIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
