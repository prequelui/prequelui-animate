import { createPrequelFileIcon } from "./prequel-file.js";

export function createPrequelFileSolidIcon(root, options = {}) {
  const controller = createPrequelFileIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
