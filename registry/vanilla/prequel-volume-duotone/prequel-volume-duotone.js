import { createPrequelVolumeIcon } from "./prequel-volume.js";

export function createPrequelVolumeDuotoneIcon(root, options = {}) {
  const controller = createPrequelVolumeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
