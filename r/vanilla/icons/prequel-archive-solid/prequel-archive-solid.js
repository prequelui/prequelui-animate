import { createPrequelArchiveIcon } from "./prequel-archive.js";

export function createPrequelArchiveSolidIcon(root, options = {}) {
  const controller = createPrequelArchiveIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
