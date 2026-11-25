import { createPrequelCreditCardIcon } from "./prequel-credit-card.js";

export function createPrequelCreditCardColorIcon(root, options = {}) {
  const controller = createPrequelCreditCardIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
