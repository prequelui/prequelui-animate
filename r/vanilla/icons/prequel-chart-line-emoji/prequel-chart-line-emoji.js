import { createPrequelChartLineIcon } from "./prequel-chart-line.js";

export function createPrequelChartLineEmojiIcon(root, options = {}) {
  const controller = createPrequelChartLineIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
