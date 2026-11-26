import { createPrequelCalendarIcon } from "./prequel-calendar.js";

export function createPrequelCalendarEmojiIcon(root, options = {}) {
  const controller = createPrequelCalendarIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
