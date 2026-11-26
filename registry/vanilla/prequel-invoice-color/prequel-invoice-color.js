import { createPrequelInvoiceIcon } from "./prequel-invoice.js";

export function createPrequelInvoiceColorIcon(root, options = {}) {
  const controller = createPrequelInvoiceIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
