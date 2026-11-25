import { createPrequelMessageIcon } from "./prequel-message.js";

export function createPrequelMessageDuotoneIcon(root, options = {}) {
  const controller = createPrequelMessageIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
