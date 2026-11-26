import { createPrequelPiggyBankIcon } from "./prequel-piggy-bank.js";

export function createPrequelPiggyBankSolidIcon(root, options = {}) {
  const controller = createPrequelPiggyBankIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
