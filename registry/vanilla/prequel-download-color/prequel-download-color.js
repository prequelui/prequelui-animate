import { createPrequelDownloadIcon } from "./prequel-download.js";

export function createPrequelDownloadColorIcon(root, options = {}) {
  const controller = createPrequelDownloadIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
