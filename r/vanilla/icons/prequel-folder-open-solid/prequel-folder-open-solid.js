import { createPrequelFolderOpenIcon } from "./prequel-folder-open.js";

export function createPrequelFolderOpenSolidIcon(root, options = {}) {
  const controller = createPrequelFolderOpenIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
