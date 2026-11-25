import { createPrequelBanknoteIcon } from "./prequel-banknote.js";

export function createPrequelBanknoteDuotoneIcon(root, options = {}) {
  const controller = createPrequelBanknoteIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
