import { createPrequelMailIcon } from "./prequel-mail.js";

export function createPrequelMailSolidIcon(root, options = {}) {
  const controller = createPrequelMailIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
