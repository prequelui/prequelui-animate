import { createPrequelLeafIcon } from "./prequel-leaf.js";

export function createPrequelLeafDuotoneIcon(root, options = {}) {
  const controller = createPrequelLeafIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
