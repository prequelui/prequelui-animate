import { createPrequelCameraIcon } from "./prequel-camera.js";

export function createPrequelCameraSolidIcon(root, options = {}) {
  const controller = createPrequelCameraIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
