import { createPrequelInboxIcon } from "./prequel-inbox.js";

export function createPrequelInboxSolidIcon(root, options = {}) {
  const controller = createPrequelInboxIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
