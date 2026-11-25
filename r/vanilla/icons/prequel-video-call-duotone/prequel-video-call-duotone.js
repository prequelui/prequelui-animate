import { createPrequelVideoCallIcon } from "./prequel-video-call.js";

export function createPrequelVideoCallDuotoneIcon(root, options = {}) {
  const controller = createPrequelVideoCallIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
