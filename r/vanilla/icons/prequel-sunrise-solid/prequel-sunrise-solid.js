import { createPrequelSunriseIcon } from "./prequel-sunrise.js";

export function createPrequelSunriseSolidIcon(root, options = {}) {
  const controller = createPrequelSunriseIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
