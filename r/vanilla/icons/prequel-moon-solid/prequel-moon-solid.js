import { createPrequelMoonIcon } from "./prequel-moon.js";

export function createPrequelMoonSolidIcon(root, options = {}) {
  const controller = createPrequelMoonIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
