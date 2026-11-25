import { createPrequelInvoiceIcon } from "./prequel-invoice.js";

export function createPrequelInvoiceEmojiIcon(root, options = {}) {
  const controller = createPrequelInvoiceIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
