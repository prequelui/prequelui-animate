import { createPrequelFolderOpenIcon } from "./prequel-folder-open.js";

export function createPrequelFolderOpenDuotoneIcon(root, options = {}) {
  const controller = createPrequelFolderOpenIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
