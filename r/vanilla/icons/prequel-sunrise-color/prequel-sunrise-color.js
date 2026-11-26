import { createPrequelSunriseIcon } from "./prequel-sunrise.js";

export function createPrequelSunriseColorIcon(root, options = {}) {
  const controller = createPrequelSunriseIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
