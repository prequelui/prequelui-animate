import { createPrequelHeartIcon } from "./prequel-heart.js";

export function createPrequelHeartSolidIcon(root, options = {}) {
  const controller = createPrequelHeartIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
