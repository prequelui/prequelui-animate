import { createPrequelPhoneIcon } from "./prequel-phone.js";

export function createPrequelPhoneSolidIcon(root, options = {}) {
  const controller = createPrequelPhoneIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
