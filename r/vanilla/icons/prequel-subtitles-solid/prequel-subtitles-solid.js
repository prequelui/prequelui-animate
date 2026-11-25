import { createPrequelSubtitlesIcon } from "./prequel-subtitles.js";

export function createPrequelSubtitlesSolidIcon(root, options = {}) {
  const controller = createPrequelSubtitlesIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
