import { createPrequelPiggyBankIcon } from "./prequel-piggy-bank.js";

export function createPrequelPiggyBankDuotoneIcon(root, options = {}) {
  const controller = createPrequelPiggyBankIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
