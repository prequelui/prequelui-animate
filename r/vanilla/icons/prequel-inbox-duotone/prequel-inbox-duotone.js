import { createPrequelInboxIcon } from "./prequel-inbox.js";

export function createPrequelInboxDuotoneIcon(root, options = {}) {
  const controller = createPrequelInboxIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
