import { createPrequelSubtitlesIcon } from "./prequel-subtitles.js";

export function createPrequelSubtitlesColorIcon(root, options = {}) {
  const controller = createPrequelSubtitlesIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
