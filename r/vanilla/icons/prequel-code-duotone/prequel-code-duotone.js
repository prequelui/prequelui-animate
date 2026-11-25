import { createPrequelCodeIcon } from "./prequel-code.js";

export function createPrequelCodeDuotoneIcon(root, options = {}) {
  const controller = createPrequelCodeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
