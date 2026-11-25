import { createPrequelSparklesIcon } from "./prequel-sparkles.js";

export function createPrequelSparklesColorIcon(root, options = {}) {
  const controller = createPrequelSparklesIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
