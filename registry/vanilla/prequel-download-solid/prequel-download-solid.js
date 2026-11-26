import { createPrequelDownloadIcon } from "./prequel-download.js";

export function createPrequelDownloadSolidIcon(root, options = {}) {
  const controller = createPrequelDownloadIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
