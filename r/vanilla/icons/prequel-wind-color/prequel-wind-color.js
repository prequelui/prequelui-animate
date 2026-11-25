import { createPrequelWindIcon } from "./prequel-wind.js";

export function createPrequelWindColorIcon(root, options = {}) {
  const controller = createPrequelWindIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
