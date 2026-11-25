import { createPrequelLinkIcon } from "./prequel-link.js";

export function createPrequelLinkSolidIcon(root, options = {}) {
  const controller = createPrequelLinkIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
