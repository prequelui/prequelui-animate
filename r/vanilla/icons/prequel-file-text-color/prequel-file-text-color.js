import { createPrequelFileTextIcon } from "./prequel-file-text.js";

export function createPrequelFileTextColorIcon(root, options = {}) {
  const controller = createPrequelFileTextIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
