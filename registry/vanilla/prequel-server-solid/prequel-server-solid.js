import { createPrequelServerIcon } from "./prequel-server.js";

export function createPrequelServerSolidIcon(root, options = {}) {
  const controller = createPrequelServerIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
