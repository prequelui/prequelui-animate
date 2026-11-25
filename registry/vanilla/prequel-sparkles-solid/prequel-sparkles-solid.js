import { createPrequelSparklesIcon } from "./prequel-sparkles.js";

export function createPrequelSparklesSolidIcon(root, options = {}) {
  const controller = createPrequelSparklesIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
