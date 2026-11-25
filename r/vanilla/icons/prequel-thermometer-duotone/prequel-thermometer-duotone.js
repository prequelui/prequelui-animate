import { createPrequelThermometerIcon } from "./prequel-thermometer.js";

export function createPrequelThermometerDuotoneIcon(root, options = {}) {
  const controller = createPrequelThermometerIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
