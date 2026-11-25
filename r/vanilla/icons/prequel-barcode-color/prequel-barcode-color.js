import { createPrequelBarcodeIcon } from "./prequel-barcode.js";

export function createPrequelBarcodeColorIcon(root, options = {}) {
  const controller = createPrequelBarcodeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
