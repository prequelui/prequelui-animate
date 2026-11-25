import { createPrequelStethoscopeIcon } from "./prequel-stethoscope.js";

export function createPrequelStethoscopeColorIcon(root, options = {}) {
  const controller = createPrequelStethoscopeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
