import { createPrequelMoonIcon } from "./prequel-moon.js";

export function createPrequelMoonColorIcon(root, options = {}) {
  const controller = createPrequelMoonIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
