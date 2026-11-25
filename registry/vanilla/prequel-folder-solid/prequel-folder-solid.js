import { createPrequelFolderIcon } from "./prequel-folder.js";

export function createPrequelFolderSolidIcon(root, options = {}) {
  const controller = createPrequelFolderIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
