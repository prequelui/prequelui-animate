import { createPrequelMailIcon } from "./prequel-mail.js";

export function createPrequelMailDuotoneIcon(root, options = {}) {
  const controller = createPrequelMailIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
