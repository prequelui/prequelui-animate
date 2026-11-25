import { createPrequelCoinsIcon } from "./prequel-coins.js";

export function createPrequelCoinsDuotoneIcon(root, options = {}) {
  const controller = createPrequelCoinsIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
