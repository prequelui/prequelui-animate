import { createPrequelDatabaseIcon } from "./prequel-database.js";

export function createPrequelDatabaseDuotoneIcon(root, options = {}) {
  const controller = createPrequelDatabaseIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
