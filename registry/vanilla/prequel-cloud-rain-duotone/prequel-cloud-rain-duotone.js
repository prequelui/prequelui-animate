import { createPrequelCloudRainIcon } from "./prequel-cloud-rain.js";

export function createPrequelCloudRainDuotoneIcon(root, options = {}) {
  const controller = createPrequelCloudRainIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
