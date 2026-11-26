import { createPrequelHotelIcon } from "./prequel-hotel.js";

export function createPrequelHotelColorIcon(root, options = {}) {
  const controller = createPrequelHotelIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
