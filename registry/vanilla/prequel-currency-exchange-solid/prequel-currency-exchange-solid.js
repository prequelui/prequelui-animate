import { createPrequelCurrencyExchangeIcon } from "./prequel-currency-exchange.js";

export function createPrequelCurrencyExchangeSolidIcon(root, options = {}) {
  const controller = createPrequelCurrencyExchangeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
