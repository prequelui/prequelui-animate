import { createPrequelCloudRainIcon } from "./prequel-cloud-rain.js";

export function createPrequelCloudRainColorIcon(root, options = {}) {
  const controller = createPrequelCloudRainIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
