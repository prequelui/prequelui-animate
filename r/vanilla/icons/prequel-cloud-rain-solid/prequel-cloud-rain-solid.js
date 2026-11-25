import { createPrequelCloudRainIcon } from "./prequel-cloud-rain.js";

export function createPrequelCloudRainSolidIcon(root, options = {}) {
  const controller = createPrequelCloudRainIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
