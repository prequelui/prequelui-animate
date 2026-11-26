import { createPrequelAlarmClockIcon } from "./prequel-alarm-clock.js";

export function createPrequelAlarmClockColorIcon(root, options = {}) {
  const controller = createPrequelAlarmClockIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
