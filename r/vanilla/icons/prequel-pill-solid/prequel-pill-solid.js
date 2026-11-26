import { createPrequelPillIcon } from "./prequel-pill.js";

export function createPrequelPillSolidIcon(root, options = {}) {
  const controller = createPrequelPillIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
