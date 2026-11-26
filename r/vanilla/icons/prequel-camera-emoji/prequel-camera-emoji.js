import { createPrequelCameraIcon } from "./prequel-camera.js";

export function createPrequelCameraEmojiIcon(root, options = {}) {
  const controller = createPrequelCameraIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
