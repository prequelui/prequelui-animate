import { createPrequelPlayIcon } from "./prequel-play.js";

export function createPrequelPlayColorIcon(root, options = {}) {
  const controller = createPrequelPlayIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
