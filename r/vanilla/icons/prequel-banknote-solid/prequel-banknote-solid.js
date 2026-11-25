import { createPrequelBanknoteIcon } from "./prequel-banknote.js";

export function createPrequelBanknoteSolidIcon(root, options = {}) {
  const controller = createPrequelBanknoteIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
