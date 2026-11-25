import { createPrequelFileIcon } from "./prequel-file.js";

export function createPrequelFileDuotoneIcon(root, options = {}) {
  const controller = createPrequelFileIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
