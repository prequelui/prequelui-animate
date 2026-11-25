import { createPrequelChartPieIcon } from "./prequel-chart-pie.js";

export function createPrequelChartPieEmojiIcon(root, options = {}) {
  const controller = createPrequelChartPieIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
