import { createPrequelFogIcon } from "./prequel-fog.js";

export function createPrequelFogColorIcon(root, options = {}) {
  const controller = createPrequelFogIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
