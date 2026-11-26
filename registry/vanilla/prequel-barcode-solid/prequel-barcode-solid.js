import { createPrequelBarcodeIcon } from "./prequel-barcode.js";

export function createPrequelBarcodeSolidIcon(root, options = {}) {
  const controller = createPrequelBarcodeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
