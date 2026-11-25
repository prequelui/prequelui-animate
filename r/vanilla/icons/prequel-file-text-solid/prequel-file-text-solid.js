import { createPrequelFileTextIcon } from "./prequel-file-text.js";

export function createPrequelFileTextSolidIcon(root, options = {}) {
  const controller = createPrequelFileTextIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
