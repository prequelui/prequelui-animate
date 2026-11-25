import { createPrequelMoonIcon } from "./prequel-moon.js";

export function createPrequelMoonDuotoneIcon(root, options = {}) {
  const controller = createPrequelMoonIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
