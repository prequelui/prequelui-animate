import { createPrequelRepeatIcon } from "./prequel-repeat.js";

export function createPrequelRepeatColorIcon(root, options = {}) {
  const controller = createPrequelRepeatIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
