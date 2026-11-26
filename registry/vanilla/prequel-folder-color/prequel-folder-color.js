import { createPrequelFolderIcon } from "./prequel-folder.js";

export function createPrequelFolderColorIcon(root, options = {}) {
  const controller = createPrequelFolderIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
