import { createPrequelReplyIcon } from "./prequel-reply.js";

export function createPrequelReplyDuotoneIcon(root, options = {}) {
  const controller = createPrequelReplyIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
