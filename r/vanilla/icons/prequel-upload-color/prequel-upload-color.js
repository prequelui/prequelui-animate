import { createPrequelUploadIcon } from "./prequel-upload.js";

export function createPrequelUploadColorIcon(root, options = {}) {
  const controller = createPrequelUploadIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
