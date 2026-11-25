import { createPrequelLeafIcon } from "./prequel-leaf.js";

export function createPrequelLeafSolidIcon(root, options = {}) {
  const controller = createPrequelLeafIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
