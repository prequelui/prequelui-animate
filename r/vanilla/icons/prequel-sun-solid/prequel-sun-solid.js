import { createPrequelSunIcon } from "./prequel-sun.js";

export function createPrequelSunSolidIcon(root, options = {}) {
  const controller = createPrequelSunIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
