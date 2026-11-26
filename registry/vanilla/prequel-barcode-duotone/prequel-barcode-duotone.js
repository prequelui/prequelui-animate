import { createPrequelBarcodeIcon } from "./prequel-barcode.js";

export function createPrequelBarcodeDuotoneIcon(root, options = {}) {
  const controller = createPrequelBarcodeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
