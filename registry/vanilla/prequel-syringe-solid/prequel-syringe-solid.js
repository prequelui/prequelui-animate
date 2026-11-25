import { createPrequelSyringeIcon } from "./prequel-syringe.js";

export function createPrequelSyringeSolidIcon(root, options = {}) {
  const controller = createPrequelSyringeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
