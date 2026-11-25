import { createPrequelCurrencyExchangeIcon } from "./prequel-currency-exchange.js";

export function createPrequelCurrencyExchangeColorIcon(root, options = {}) {
  const controller = createPrequelCurrencyExchangeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
