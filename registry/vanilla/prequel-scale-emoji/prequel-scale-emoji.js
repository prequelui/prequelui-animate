import { createPrequelScaleIcon } from "./prequel-scale.js";

export function createPrequelScaleEmojiIcon(root, options = {}) {
  const controller = createPrequelScaleIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
