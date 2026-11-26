import { createPrequelArchiveIcon } from "./prequel-archive.js";

export function createPrequelArchiveColorIcon(root, options = {}) {
  const controller = createPrequelArchiveIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
