import { createPrequelCouponIcon } from "./prequel-coupon.js";

export function createPrequelCouponSolidIcon(root, options = {}) {
  const controller = createPrequelCouponIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
