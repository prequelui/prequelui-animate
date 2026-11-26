import { createPrequelPlayIcon } from "./prequel-play.js";

export function createPrequelPlayDuotoneIcon(root, options = {}) {
  const controller = createPrequelPlayIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
