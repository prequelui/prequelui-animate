import { createPrequelRssIcon } from "./prequel-rss.js";

export function createPrequelRssSolidIcon(root, options = {}) {
  const controller = createPrequelRssIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
