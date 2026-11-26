import { createPrequelWalletIcon } from "./prequel-wallet.js";

export function createPrequelWalletEmojiIcon(root, options = {}) {
  const controller = createPrequelWalletIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
