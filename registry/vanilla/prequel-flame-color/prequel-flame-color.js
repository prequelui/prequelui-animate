import { createPrequelFlameIcon } from "./prequel-flame.js";

export function createPrequelFlameColorIcon(root, options = {}) {
  const controller = createPrequelFlameIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
