import { createPrequelThermometerIcon } from "./prequel-thermometer.js";

export function createPrequelThermometerSolidIcon(root, options = {}) {
  const controller = createPrequelThermometerIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
