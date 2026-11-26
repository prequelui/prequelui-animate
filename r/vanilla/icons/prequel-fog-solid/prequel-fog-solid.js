import { createPrequelFogIcon } from "./prequel-fog.js";

export function createPrequelFogSolidIcon(root, options = {}) {
  const controller = createPrequelFogIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
