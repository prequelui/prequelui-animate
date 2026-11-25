import { createPrequelCloudIcon } from "./prequel-cloud.js";

export function createPrequelCloudColorIcon(root, options = {}) {
  const controller = createPrequelCloudIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
