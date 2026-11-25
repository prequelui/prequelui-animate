import { createPrequelBrainCircuitIcon } from "./prequel-brain-circuit.js";

export function createPrequelBrainCircuitColorIcon(root, options = {}) {
  const controller = createPrequelBrainCircuitIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
