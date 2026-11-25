import { createPrequelCoinsIcon } from "./prequel-coins.js";

export function createPrequelCoinsColorIcon(root, options = {}) {
  const controller = createPrequelCoinsIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
