import { createPrequelCodeIcon } from "./prequel-code.js";

export function createPrequelCodeSolidIcon(root, options = {}) {
  const controller = createPrequelCodeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
