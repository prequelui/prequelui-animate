import { createPrequelMicrophoneIcon } from "./prequel-mic.js";

export function createPrequelMicrophoneDuotoneIcon(root, options = {}) {
  const controller = createPrequelMicrophoneIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
