import { createPrequelFirstAidIcon } from "./prequel-first-aid.js";

export function createPrequelFirstAidDuotoneIcon(root, options = {}) {
  const controller = createPrequelFirstAidIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
