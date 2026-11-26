import { createPrequelAlarmClockIcon } from "./prequel-alarm-clock.js";

export function createPrequelAlarmClockSolidIcon(root, options = {}) {
  const controller = createPrequelAlarmClockIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
