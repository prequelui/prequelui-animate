import { createPrequelHotelIcon } from "./prequel-hotel.js";

export function createPrequelHotelEmojiIcon(root, options = {}) {
  const controller = createPrequelHotelIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
