import { createPrequelSyringeIcon } from "./prequel-syringe.js";

export function createPrequelSyringeColorIcon(root, options = {}) {
  const controller = createPrequelSyringeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
