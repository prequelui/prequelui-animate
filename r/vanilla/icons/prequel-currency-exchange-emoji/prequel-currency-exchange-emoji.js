import { createPrequelCurrencyExchangeIcon } from "./prequel-currency-exchange.js";

export function createPrequelCurrencyExchangeEmojiIcon(root, options = {}) {
  const controller = createPrequelCurrencyExchangeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
