import { createPrequelFirstAidIcon } from "./prequel-first-aid.js";

export function createPrequelFirstAidSolidIcon(root, options = {}) {
  const controller = createPrequelFirstAidIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
