import { createPrequelReplyIcon } from "./prequel-reply.js";

export function createPrequelReplySolidIcon(root, options = {}) {
  const controller = createPrequelReplyIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
