import { createPrequelPauseIcon } from "./prequel-pause.js";

export function createPrequelPauseColorIcon(root, options = {}) {
  const controller = createPrequelPauseIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
