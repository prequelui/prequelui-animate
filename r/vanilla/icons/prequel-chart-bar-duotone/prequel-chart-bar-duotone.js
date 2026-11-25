import { createPrequelChartBarIcon } from "./prequel-chart-bar.js";

export function createPrequelChartBarDuotoneIcon(root, options = {}) {
  const controller = createPrequelChartBarIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
