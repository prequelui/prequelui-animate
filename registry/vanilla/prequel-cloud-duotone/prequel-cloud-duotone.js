import { createPrequelCloudIcon } from "./prequel-cloud.js";

export function createPrequelCloudDuotoneIcon(root, options = {}) {
  const controller = createPrequelCloudIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
