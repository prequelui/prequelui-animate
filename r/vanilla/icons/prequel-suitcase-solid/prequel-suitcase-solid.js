import { createPrequelSuitcaseIcon } from "./prequel-suitcase.js";

export function createPrequelSuitcaseSolidIcon(root, options = {}) {
  const controller = createPrequelSuitcaseIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
