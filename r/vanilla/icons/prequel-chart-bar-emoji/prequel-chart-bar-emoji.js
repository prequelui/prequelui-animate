import { createPrequelChartBarIcon } from "./prequel-chart-bar.js";

export function createPrequelChartBarEmojiIcon(root, options = {}) {
  const controller = createPrequelChartBarIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
