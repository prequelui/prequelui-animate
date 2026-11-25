import { createPrequelLightningIcon } from "./prequel-lightning.js";

export function createPrequelLightningEmojiIcon(root, options = {}) {
  const controller = createPrequelLightningIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
