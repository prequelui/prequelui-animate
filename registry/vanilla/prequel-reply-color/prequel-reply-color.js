import { createPrequelReplyIcon } from "./prequel-reply.js";

export function createPrequelReplyColorIcon(root, options = {}) {
  const controller = createPrequelReplyIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
