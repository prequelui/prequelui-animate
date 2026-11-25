import { createPrequelSubtitlesIcon } from "./prequel-subtitles.js";

export function createPrequelSubtitlesDuotoneIcon(root, options = {}) {
  const controller = createPrequelSubtitlesIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
