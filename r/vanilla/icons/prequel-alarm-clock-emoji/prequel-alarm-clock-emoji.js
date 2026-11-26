import { createPrequelAlarmClockIcon } from "./prequel-alarm-clock.js";

export function createPrequelAlarmClockEmojiIcon(root, options = {}) {
  const controller = createPrequelAlarmClockIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
