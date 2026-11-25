import { createPrequelCameraIcon } from "./prequel-camera.js";

export function createPrequelCameraDuotoneIcon(root, options = {}) {
  const controller = createPrequelCameraIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
