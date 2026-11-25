import { createPrequelChartLineIcon } from "./prequel-chart-line.js";

export function createPrequelChartLineDuotoneIcon(root, options = {}) {
  const controller = createPrequelChartLineIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
