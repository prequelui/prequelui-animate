import { createPrequelNeuralIcon } from "./prequel-neural.js";

export function createPrequelNeuralSolidIcon(root, options = {}) {
  const controller = createPrequelNeuralIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
