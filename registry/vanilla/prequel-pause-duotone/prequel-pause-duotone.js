import { createPrequelPauseIcon } from "./prequel-pause.js";

export function createPrequelPauseDuotoneIcon(root, options = {}) {
  const controller = createPrequelPauseIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
