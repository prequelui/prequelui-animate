import { createPrequelBankIcon } from "./prequel-bank.js";

export function createPrequelBankSolidIcon(root, options = {}) {
  const controller = createPrequelBankIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
