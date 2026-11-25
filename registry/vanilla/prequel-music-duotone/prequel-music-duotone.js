import { createPrequelMusicIcon } from "./prequel-music.js";

export function createPrequelMusicDuotoneIcon(root, options = {}) {
  const controller = createPrequelMusicIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
