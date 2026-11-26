import { createPrequelSyringeIcon } from "./prequel-syringe.js";

export function createPrequelSyringeDuotoneIcon(root, options = {}) {
  const controller = createPrequelSyringeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
