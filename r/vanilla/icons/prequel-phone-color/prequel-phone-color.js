import { createPrequelPhoneIcon } from "./prequel-phone.js";

export function createPrequelPhoneColorIcon(root, options = {}) {
  const controller = createPrequelPhoneIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
