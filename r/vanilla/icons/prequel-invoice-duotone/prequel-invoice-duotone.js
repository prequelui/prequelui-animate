import { createPrequelInvoiceIcon } from "./prequel-invoice.js";

export function createPrequelInvoiceDuotoneIcon(root, options = {}) {
  const controller = createPrequelInvoiceIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
