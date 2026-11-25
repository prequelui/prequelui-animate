import { createPrequelThermometerIcon } from "./prequel-thermometer.js";

export function createPrequelThermometerColorIcon(root, options = {}) {
  const controller = createPrequelThermometerIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
