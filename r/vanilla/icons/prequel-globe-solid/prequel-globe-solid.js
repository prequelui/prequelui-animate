import { createPrequelGlobeIcon } from "./prequel-globe.js";

export function createPrequelGlobeSolidIcon(root, options = {}) {
  const controller = createPrequelGlobeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
