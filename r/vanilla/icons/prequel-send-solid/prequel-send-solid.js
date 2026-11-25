import { createPrequelSendIcon } from "./prequel-send.js";

export function createPrequelSendSolidIcon(root, options = {}) {
  const controller = createPrequelSendIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
