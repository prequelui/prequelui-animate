import { createPrequelRadioIcon } from "./prequel-radio.js";

export function createPrequelRadioSolidIcon(root, options = {}) {
  const controller = createPrequelRadioIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
