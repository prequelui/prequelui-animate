import { createPrequelLinkIcon } from "./prequel-link.js";

export function createPrequelLinkColorIcon(root, options = {}) {
  const controller = createPrequelLinkIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
