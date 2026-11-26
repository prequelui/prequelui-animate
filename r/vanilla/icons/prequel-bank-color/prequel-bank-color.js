import { createPrequelBankIcon } from "./prequel-bank.js";

export function createPrequelBankColorIcon(root, options = {}) {
  const controller = createPrequelBankIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
