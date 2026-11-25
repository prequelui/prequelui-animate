import { createPrequelCouponIcon } from "./prequel-coupon.js";

export function createPrequelCouponDuotoneIcon(root, options = {}) {
  const controller = createPrequelCouponIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
