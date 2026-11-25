import { createPrequelRadioIcon } from "./prequel-radio.js";

export function createPrequelRadioColorIcon(root, options = {}) {
  const controller = createPrequelRadioIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
