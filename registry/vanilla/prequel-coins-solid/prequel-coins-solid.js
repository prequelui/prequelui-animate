import { createPrequelCoinsIcon } from "./prequel-coins.js";

export function createPrequelCoinsSolidIcon(root, options = {}) {
  const controller = createPrequelCoinsIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
