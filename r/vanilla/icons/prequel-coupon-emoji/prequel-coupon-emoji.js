import { createPrequelCouponIcon } from "./prequel-coupon.js";

export function createPrequelCouponEmojiIcon(root, options = {}) {
  const controller = createPrequelCouponIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
