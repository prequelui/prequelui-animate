import { createPrequelSafeIcon } from "./prequel-safe.js";

export function createPrequelSafeColorIcon(root, options = {}) {
  const controller = createPrequelSafeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
