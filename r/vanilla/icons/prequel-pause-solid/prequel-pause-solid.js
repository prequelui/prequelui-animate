import { createPrequelPauseIcon } from "./prequel-pause.js";

export function createPrequelPauseSolidIcon(root, options = {}) {
  const controller = createPrequelPauseIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
