import { createPrequelArchiveIcon } from "./prequel-archive.js";

export function createPrequelArchiveDuotoneIcon(root, options = {}) {
  const controller = createPrequelArchiveIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
