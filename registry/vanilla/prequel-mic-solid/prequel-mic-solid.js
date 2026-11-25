import { createPrequelMicrophoneIcon } from "./prequel-mic.js";

export function createPrequelMicrophoneSolidIcon(root, options = {}) {
  const controller = createPrequelMicrophoneIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
