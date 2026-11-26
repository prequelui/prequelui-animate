import { createPrequelNeuralIcon } from "./prequel-neural.js";

export function createPrequelNeuralDuotoneIcon(root, options = {}) {
  const controller = createPrequelNeuralIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
