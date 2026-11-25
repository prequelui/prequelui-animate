import { createPrequelDropletIcon } from "./prequel-droplet.js";

export function createPrequelDropletColorIcon(root, options = {}) {
  const controller = createPrequelDropletIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
