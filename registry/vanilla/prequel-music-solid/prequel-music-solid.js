import { createPrequelMusicIcon } from "./prequel-music.js";

export function createPrequelMusicSolidIcon(root, options = {}) {
  const controller = createPrequelMusicIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
