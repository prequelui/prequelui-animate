import { createPrequelReceiptIcon } from "./prequel-receipt.js";

export function createPrequelReceiptDuotoneIcon(root, options = {}) {
  const controller = createPrequelReceiptIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
