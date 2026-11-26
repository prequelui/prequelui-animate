import { createPrequelPillIcon } from "./prequel-pill.js";

export function createPrequelPillColorIcon(root, options = {}) {
  const controller = createPrequelPillIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
