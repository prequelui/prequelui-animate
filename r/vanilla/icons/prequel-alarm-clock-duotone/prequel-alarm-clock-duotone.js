import { createPrequelAlarmClockIcon } from "./prequel-alarm-clock.js";

export function createPrequelAlarmClockDuotoneIcon(root, options = {}) {
  const controller = createPrequelAlarmClockIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
