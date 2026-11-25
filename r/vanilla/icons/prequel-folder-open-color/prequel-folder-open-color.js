import { createPrequelFolderOpenIcon } from "./prequel-folder-open.js";

export function createPrequelFolderOpenColorIcon(root, options = {}) {
  const controller = createPrequelFolderOpenIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
