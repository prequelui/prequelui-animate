import { createPrequelFilePlusIcon } from "./prequel-file-plus.js";

export function createPrequelFilePlusDuotoneIcon(root, options = {}) {
  const controller = createPrequelFilePlusIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
