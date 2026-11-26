import { createPrequelVolumeIcon } from "./prequel-volume.js";

export function createPrequelVolumeColorIcon(root, options = {}) {
  const controller = createPrequelVolumeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
