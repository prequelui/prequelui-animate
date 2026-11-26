import { createPrequelFlameIcon } from "./prequel-flame.js";

export function createPrequelFlameSolidIcon(root, options = {}) {
  const controller = createPrequelFlameIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
