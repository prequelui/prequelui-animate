import { createPrequelVideoCallIcon } from "./prequel-video-call.js";

export function createPrequelVideoCallColorIcon(root, options = {}) {
  const controller = createPrequelVideoCallIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
