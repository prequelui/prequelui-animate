import { createPrequelCodeIcon } from "./prequel-code.js";

export function createPrequelCodeColorIcon(root, options = {}) {
  const controller = createPrequelCodeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
