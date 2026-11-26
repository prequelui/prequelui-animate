import { createPrequelStethoscopeIcon } from "./prequel-stethoscope.js";

export function createPrequelStethoscopeSolidIcon(root, options = {}) {
  const controller = createPrequelStethoscopeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
