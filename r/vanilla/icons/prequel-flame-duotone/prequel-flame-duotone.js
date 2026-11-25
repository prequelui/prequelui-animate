import { createPrequelFlameIcon } from "./prequel-flame.js";

export function createPrequelFlameDuotoneIcon(root, options = {}) {
  const controller = createPrequelFlameIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
