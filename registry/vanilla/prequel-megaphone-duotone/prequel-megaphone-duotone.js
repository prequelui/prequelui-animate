import { createPrequelMegaphoneIcon } from "./prequel-megaphone.js";

export function createPrequelMegaphoneDuotoneIcon(root, options = {}) {
  const controller = createPrequelMegaphoneIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
