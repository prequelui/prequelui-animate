import { createPrequelSunIcon } from "./prequel-sun.js";

export function createPrequelSunColorIcon(root, options = {}) {
  const controller = createPrequelSunIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
