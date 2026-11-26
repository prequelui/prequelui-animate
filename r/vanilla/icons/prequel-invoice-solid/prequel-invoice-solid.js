import { createPrequelInvoiceIcon } from "./prequel-invoice.js";

export function createPrequelInvoiceSolidIcon(root, options = {}) {
  const controller = createPrequelInvoiceIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
