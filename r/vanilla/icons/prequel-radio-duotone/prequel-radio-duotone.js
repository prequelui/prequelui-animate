import { createPrequelRadioIcon } from "./prequel-radio.js";

export function createPrequelRadioDuotoneIcon(root, options = {}) {
  const controller = createPrequelRadioIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
