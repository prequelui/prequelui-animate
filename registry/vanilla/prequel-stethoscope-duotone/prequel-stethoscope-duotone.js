import { createPrequelStethoscopeIcon } from "./prequel-stethoscope.js";

export function createPrequelStethoscopeDuotoneIcon(root, options = {}) {
  const controller = createPrequelStethoscopeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
