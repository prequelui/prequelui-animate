import { createPrequelVolumeIcon } from "./prequel-volume.js";

export function createPrequelVolumeSolidIcon(root, options = {}) {
  const controller = createPrequelVolumeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
