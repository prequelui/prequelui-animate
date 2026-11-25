import { createPrequelSuitcaseIcon } from "./prequel-suitcase.js";

export function createPrequelSuitcaseDuotoneIcon(root, options = {}) {
  const controller = createPrequelSuitcaseIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
