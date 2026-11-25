import { createPrequelHeadphonesIcon } from "./prequel-headphones.js";

export function createPrequelHeadphonesDuotoneIcon(root, options = {}) {
  const controller = createPrequelHeadphonesIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
