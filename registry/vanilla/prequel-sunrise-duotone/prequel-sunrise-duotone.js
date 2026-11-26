import { createPrequelSunriseIcon } from "./prequel-sunrise.js";

export function createPrequelSunriseDuotoneIcon(root, options = {}) {
  const controller = createPrequelSunriseIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
