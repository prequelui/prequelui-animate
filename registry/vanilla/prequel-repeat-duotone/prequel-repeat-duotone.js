import { createPrequelRepeatIcon } from "./prequel-repeat.js";

export function createPrequelRepeatDuotoneIcon(root, options = {}) {
  const controller = createPrequelRepeatIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
