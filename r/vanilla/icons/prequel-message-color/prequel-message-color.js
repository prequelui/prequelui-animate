import { createPrequelMessageIcon } from "./prequel-message.js";

export function createPrequelMessageColorIcon(root, options = {}) {
  const controller = createPrequelMessageIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
