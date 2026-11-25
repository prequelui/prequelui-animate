import { createPrequelCouponIcon } from "./prequel-coupon.js";

export function createPrequelCouponColorIcon(root, options = {}) {
  const controller = createPrequelCouponIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
