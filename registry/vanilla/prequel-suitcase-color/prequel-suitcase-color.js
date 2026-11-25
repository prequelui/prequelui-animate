import { createPrequelSuitcaseIcon } from "./prequel-suitcase.js";

export function createPrequelSuitcaseColorIcon(root, options = {}) {
  const controller = createPrequelSuitcaseIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
