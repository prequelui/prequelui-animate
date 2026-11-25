import { createPrequelBrainCircuitIcon } from "./prequel-brain-circuit.js";

export function createPrequelBrainCircuitSolidIcon(root, options = {}) {
  const controller = createPrequelBrainCircuitIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
