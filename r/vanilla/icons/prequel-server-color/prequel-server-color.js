import { createPrequelServerIcon } from "./prequel-server.js";

export function createPrequelServerColorIcon(root, options = {}) {
  const controller = createPrequelServerIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
