import { createPrequelHeadphonesIcon } from "./prequel-headphones.js";

export function createPrequelHeadphonesSolidIcon(root, options = {}) {
  const controller = createPrequelHeadphonesIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
