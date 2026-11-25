import { createPrequelLinkIcon } from "./prequel-link.js";

export function createPrequelLinkDuotoneIcon(root, options = {}) {
  const controller = createPrequelLinkIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
