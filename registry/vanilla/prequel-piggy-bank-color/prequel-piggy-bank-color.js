import { createPrequelPiggyBankIcon } from "./prequel-piggy-bank.js";

export function createPrequelPiggyBankColorIcon(root, options = {}) {
  const controller = createPrequelPiggyBankIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
