import { createPrequelFileTextIcon } from "./prequel-file-text.js";

export function createPrequelFileTextDuotoneIcon(root, options = {}) {
  const controller = createPrequelFileTextIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
