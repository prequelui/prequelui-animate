import { createPrequelUploadIcon } from "./prequel-upload.js";

export function createPrequelUploadSolidIcon(root, options = {}) {
  const controller = createPrequelUploadIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
