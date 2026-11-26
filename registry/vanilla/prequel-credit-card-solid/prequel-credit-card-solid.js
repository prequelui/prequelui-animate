import { createPrequelCreditCardIcon } from "./prequel-credit-card.js";

export function createPrequelCreditCardSolidIcon(root, options = {}) {
  const controller = createPrequelCreditCardIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
