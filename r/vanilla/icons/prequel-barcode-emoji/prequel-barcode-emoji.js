import { createPrequelBarcodeIcon } from "./prequel-barcode.js";

export function createPrequelBarcodeEmojiIcon(root, options = {}) {
  const controller = createPrequelBarcodeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
