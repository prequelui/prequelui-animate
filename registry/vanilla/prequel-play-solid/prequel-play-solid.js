import { createPrequelPlayIcon } from "./prequel-play.js";

export function createPrequelPlaySolidIcon(root, options = {}) {
  const controller = createPrequelPlayIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
