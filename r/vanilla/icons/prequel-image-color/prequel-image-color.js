import { createPrequelImageIcon } from "./prequel-image.js";

export function createPrequelImageColorIcon(root, options = {}) {
  const controller = createPrequelImageIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
