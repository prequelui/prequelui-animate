import { createPrequelServerIcon } from "./prequel-server.js";

export function createPrequelServerDuotoneIcon(root, options = {}) {
  const controller = createPrequelServerIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
