import { createPrequelHotelIcon } from "./prequel-hotel.js";

export function createPrequelHotelSolidIcon(root, options = {}) {
  const controller = createPrequelHotelIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
