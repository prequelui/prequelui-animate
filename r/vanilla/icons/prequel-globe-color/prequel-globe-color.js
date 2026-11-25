import { createPrequelGlobeIcon } from "./prequel-globe.js";

export function createPrequelGlobeColorIcon(root, options = {}) {
  const controller = createPrequelGlobeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
