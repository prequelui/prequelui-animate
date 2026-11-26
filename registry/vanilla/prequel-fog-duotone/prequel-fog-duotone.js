import { createPrequelFogIcon } from "./prequel-fog.js";

export function createPrequelFogDuotoneIcon(root, options = {}) {
  const controller = createPrequelFogIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
