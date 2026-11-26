import { createPrequelVideoCallIcon } from "./prequel-video-call.js";

export function createPrequelVideoCallSolidIcon(root, options = {}) {
  const controller = createPrequelVideoCallIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
