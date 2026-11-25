import { createPrequelWalletIcon } from "./prequel-wallet.js";

export function createPrequelWalletColorIcon(root, options = {}) {
  const controller = createPrequelWalletIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
