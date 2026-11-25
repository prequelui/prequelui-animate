import { createPrequelCurrencyExchangeIcon } from "./prequel-currency-exchange.js";

export function createPrequelCurrencyExchangeDuotoneIcon(root, options = {}) {
  const controller = createPrequelCurrencyExchangeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
