import { createPrequelMicrophoneIcon } from "./prequel-mic.js";

export function createPrequelMicrophoneColorIcon(root, options = {}) {
  const controller = createPrequelMicrophoneIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
