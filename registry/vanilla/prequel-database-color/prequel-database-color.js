import { createPrequelDatabaseIcon } from "./prequel-database.js";

export function createPrequelDatabaseColorIcon(root, options = {}) {
  const controller = createPrequelDatabaseIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
