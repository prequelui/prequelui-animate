import { createPrequelSafeIcon } from "./prequel-safe.js";

export function createPrequelSafeSolidIcon(root, options = {}) {
  const controller = createPrequelSafeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
