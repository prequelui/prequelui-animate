import { createPrequelDnaIcon } from "./prequel-dna.js";

export function createPrequelDnaSolidIcon(root, options = {}) {
  const controller = createPrequelDnaIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
