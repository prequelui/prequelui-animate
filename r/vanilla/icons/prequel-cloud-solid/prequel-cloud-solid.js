import { createPrequelCloudIcon } from "./prequel-cloud.js";

export function createPrequelCloudSolidIcon(root, options = {}) {
  const controller = createPrequelCloudIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
