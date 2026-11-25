import { createPrequelWalletIcon } from "./prequel-wallet.js";

export function createPrequelWalletSolidIcon(root, options = {}) {
  const controller = createPrequelWalletIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
