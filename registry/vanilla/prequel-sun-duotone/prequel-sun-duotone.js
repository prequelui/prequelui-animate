import { createPrequelSunIcon } from "./prequel-sun.js";

export function createPrequelSunDuotoneIcon(root, options = {}) {
  const controller = createPrequelSunIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
