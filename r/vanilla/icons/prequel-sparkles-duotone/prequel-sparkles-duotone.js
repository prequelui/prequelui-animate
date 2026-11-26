import { createPrequelSparklesIcon } from "./prequel-sparkles.js";

export function createPrequelSparklesDuotoneIcon(root, options = {}) {
  const controller = createPrequelSparklesIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
