import { createPrequelUploadIcon } from "./prequel-upload.js";

export function createPrequelUploadDuotoneIcon(root, options = {}) {
  const controller = createPrequelUploadIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
