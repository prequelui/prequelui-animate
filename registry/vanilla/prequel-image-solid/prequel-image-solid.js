import { createPrequelImageIcon } from "./prequel-image.js";

export function createPrequelImageSolidIcon(root, options = {}) {
  const controller = createPrequelImageIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
