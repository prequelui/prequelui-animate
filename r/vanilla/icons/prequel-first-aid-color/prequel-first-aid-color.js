import { createPrequelFirstAidIcon } from "./prequel-first-aid.js";

export function createPrequelFirstAidColorIcon(root, options = {}) {
  const controller = createPrequelFirstAidIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
