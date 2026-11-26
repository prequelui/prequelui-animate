import { createPrequelFileIcon } from "./prequel-file.js";

export function createPrequelFileColorIcon(root, options = {}) {
  const controller = createPrequelFileIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
