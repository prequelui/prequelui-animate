import { createPrequelRssIcon } from "./prequel-rss.js";

export function createPrequelRssColorIcon(root, options = {}) {
  const controller = createPrequelRssIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
