import { createPrequelHeartIcon } from "./prequel-heart.js";

export function createPrequelHeartDuotoneIcon(root, options = {}) {
  const controller = createPrequelHeartIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
