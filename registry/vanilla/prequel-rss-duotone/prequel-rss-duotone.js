import { createPrequelRssIcon } from "./prequel-rss.js";

export function createPrequelRssDuotoneIcon(root, options = {}) {
  const controller = createPrequelRssIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
