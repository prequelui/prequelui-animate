import { createPrequelDatabaseIcon } from "./prequel-database.js";

export function createPrequelDatabaseSolidIcon(root, options = {}) {
  const controller = createPrequelDatabaseIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
