import { createPrequelFilePlusIcon } from "./prequel-file-plus.js";

export function createPrequelFilePlusColorIcon(root, options = {}) {
  const controller = createPrequelFilePlusIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
