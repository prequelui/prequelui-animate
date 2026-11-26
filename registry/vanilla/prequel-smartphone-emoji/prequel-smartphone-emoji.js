import { createPrequelSmartphoneIcon } from "./prequel-smartphone.js";

export function createPrequelSmartphoneEmojiIcon(root, options = {}) {
  const controller = createPrequelSmartphoneIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
