import { createPrequelDropletIcon } from "./prequel-droplet.js";

export function createPrequelDropletSolidIcon(root, options = {}) {
  const controller = createPrequelDropletIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
