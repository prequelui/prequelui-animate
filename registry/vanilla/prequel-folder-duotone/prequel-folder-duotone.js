import { createPrequelFolderIcon } from "./prequel-folder.js";

export function createPrequelFolderDuotoneIcon(root, options = {}) {
  const controller = createPrequelFolderIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
