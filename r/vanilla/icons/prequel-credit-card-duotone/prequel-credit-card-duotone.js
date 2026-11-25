import { createPrequelCreditCardIcon } from "./prequel-credit-card.js";

export function createPrequelCreditCardDuotoneIcon(root, options = {}) {
  const controller = createPrequelCreditCardIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
