import { createPrequelMusicIcon } from "./prequel-music.js";

export function createPrequelMusicColorIcon(root, options = {}) {
  const controller = createPrequelMusicIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
