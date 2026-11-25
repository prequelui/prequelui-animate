import { createPrequelBanknoteIcon } from "./prequel-banknote.js";

export function createPrequelBanknoteColorIcon(root, options = {}) {
  const controller = createPrequelBanknoteIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
