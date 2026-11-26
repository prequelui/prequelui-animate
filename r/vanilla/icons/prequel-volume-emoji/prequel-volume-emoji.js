import { createPrequelVolumeIcon } from "./prequel-volume.js";

export function createPrequelVolumeEmojiIcon(root, options = {}) {
  const controller = createPrequelVolumeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
