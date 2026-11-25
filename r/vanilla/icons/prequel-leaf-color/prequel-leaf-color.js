import { createPrequelLeafIcon } from "./prequel-leaf.js";

export function createPrequelLeafColorIcon(root, options = {}) {
  const controller = createPrequelLeafIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
