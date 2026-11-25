import { createPrequelRepeatIcon } from "./prequel-repeat.js";

export function createPrequelRepeatSolidIcon(root, options = {}) {
  const controller = createPrequelRepeatIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
