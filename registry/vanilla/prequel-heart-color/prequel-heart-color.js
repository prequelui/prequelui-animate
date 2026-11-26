import { createPrequelHeartIcon } from "./prequel-heart.js";

export function createPrequelHeartColorIcon(root, options = {}) {
  const controller = createPrequelHeartIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
