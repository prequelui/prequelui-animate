import { createPrequelMessageIcon } from "./prequel-message.js";

export function createPrequelMessageSolidIcon(root, options = {}) {
  const controller = createPrequelMessageIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
