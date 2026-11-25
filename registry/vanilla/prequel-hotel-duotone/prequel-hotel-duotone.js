import { createPrequelHotelIcon } from "./prequel-hotel.js";

export function createPrequelHotelDuotoneIcon(root, options = {}) {
  const controller = createPrequelHotelIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
