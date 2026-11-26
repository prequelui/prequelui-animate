import { createPrequelCameraIcon } from "./prequel-camera.js";

export function createPrequelCameraColorIcon(root, options = {}) {
  const controller = createPrequelCameraIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
