import { createPrequelReceiptIcon } from "./prequel-receipt.js";

export function createPrequelReceiptSolidIcon(root, options = {}) {
  const controller = createPrequelReceiptIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
