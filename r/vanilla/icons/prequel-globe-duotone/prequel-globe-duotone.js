import { createPrequelGlobeIcon } from "./prequel-globe.js";

export function createPrequelGlobeDuotoneIcon(root, options = {}) {
  const controller = createPrequelGlobeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
