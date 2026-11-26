import { createPrequelInboxIcon } from "./prequel-inbox.js";

export function createPrequelInboxColorIcon(root, options = {}) {
  const controller = createPrequelInboxIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
