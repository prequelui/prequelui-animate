import { createPrequelReceiptIcon } from "./prequel-receipt.js";

export function createPrequelReceiptColorIcon(root, options = {}) {
  const controller = createPrequelReceiptIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
