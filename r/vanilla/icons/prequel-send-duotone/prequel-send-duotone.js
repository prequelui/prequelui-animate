import { createPrequelSendIcon } from "./prequel-send.js";

export function createPrequelSendDuotoneIcon(root, options = {}) {
  const controller = createPrequelSendIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
