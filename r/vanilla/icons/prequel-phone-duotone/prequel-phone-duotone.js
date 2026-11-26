import { createPrequelPhoneIcon } from "./prequel-phone.js";

export function createPrequelPhoneDuotoneIcon(root, options = {}) {
  const controller = createPrequelPhoneIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
