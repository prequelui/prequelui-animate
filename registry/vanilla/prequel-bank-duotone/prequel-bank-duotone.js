import { createPrequelBankIcon } from "./prequel-bank.js";

export function createPrequelBankDuotoneIcon(root, options = {}) {
  const controller = createPrequelBankIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
