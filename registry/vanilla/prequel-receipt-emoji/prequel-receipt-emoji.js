import { createPrequelReceiptIcon } from "./prequel-receipt.js";

export function createPrequelReceiptEmojiIcon(root, options = {}) {
  const controller = createPrequelReceiptIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
