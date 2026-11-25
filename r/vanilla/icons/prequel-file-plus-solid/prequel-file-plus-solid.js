import { createPrequelFilePlusIcon } from "./prequel-file-plus.js";

export function createPrequelFilePlusSolidIcon(root, options = {}) {
  const controller = createPrequelFilePlusIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
