import { createPrequelBrainCircuitIcon } from "./prequel-brain-circuit.js";

export function createPrequelBrainCircuitDuotoneIcon(root, options = {}) {
  const controller = createPrequelBrainCircuitIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
