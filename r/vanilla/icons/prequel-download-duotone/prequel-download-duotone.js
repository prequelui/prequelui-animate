import { createPrequelDownloadIcon } from "./prequel-download.js";

export function createPrequelDownloadDuotoneIcon(root, options = {}) {
  const controller = createPrequelDownloadIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
