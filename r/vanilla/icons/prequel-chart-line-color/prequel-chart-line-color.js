import { createPrequelChartLineIcon } from "./prequel-chart-line.js";

export function createPrequelChartLineColorIcon(root, options = {}) {
  const controller = createPrequelChartLineIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
