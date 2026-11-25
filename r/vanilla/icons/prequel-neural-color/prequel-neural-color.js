import { createPrequelNeuralIcon } from "./prequel-neural.js";

export function createPrequelNeuralColorIcon(root, options = {}) {
  const controller = createPrequelNeuralIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
