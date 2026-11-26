import { createPrequelDnaIcon } from "./prequel-dna.js";

export function createPrequelDnaDuotoneIcon(root, options = {}) {
  const controller = createPrequelDnaIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
