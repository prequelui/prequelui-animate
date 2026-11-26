import { createPrequelDropletIcon } from "./prequel-droplet.js";

export function createPrequelDropletDuotoneIcon(root, options = {}) {
  const controller = createPrequelDropletIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
