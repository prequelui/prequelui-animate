import { createPrequelDnaIcon } from "./prequel-dna.js";

export function createPrequelDnaColorIcon(root, options = {}) {
  const controller = createPrequelDnaIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
