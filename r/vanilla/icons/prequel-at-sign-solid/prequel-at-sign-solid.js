import { createPrequelAtSignIcon } from "./prequel-at-sign.js";

export function createPrequelAtSignSolidIcon(root, options = {}) {
  const controller = createPrequelAtSignIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
