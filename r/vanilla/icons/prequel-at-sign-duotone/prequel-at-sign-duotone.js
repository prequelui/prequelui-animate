import { createPrequelAtSignIcon } from "./prequel-at-sign.js";

export function createPrequelAtSignDuotoneIcon(root, options = {}) {
  const controller = createPrequelAtSignIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
