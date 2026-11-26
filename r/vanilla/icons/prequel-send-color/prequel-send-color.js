import { createPrequelSendIcon } from "./prequel-send.js";

export function createPrequelSendColorIcon(root, options = {}) {
  const controller = createPrequelSendIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
