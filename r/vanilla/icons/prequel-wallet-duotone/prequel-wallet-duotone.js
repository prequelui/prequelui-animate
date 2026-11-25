import { createPrequelWalletIcon } from "./prequel-wallet.js";

export function createPrequelWalletDuotoneIcon(root, options = {}) {
  const controller = createPrequelWalletIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
