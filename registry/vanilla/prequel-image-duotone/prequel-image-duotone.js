import { createPrequelImageIcon } from "./prequel-image.js";

export function createPrequelImageDuotoneIcon(root, options = {}) {
  const controller = createPrequelImageIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
