import { createPrequelSafeIcon } from "./prequel-safe.js";

export function createPrequelSafeDuotoneIcon(root, options = {}) {
  const controller = createPrequelSafeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
