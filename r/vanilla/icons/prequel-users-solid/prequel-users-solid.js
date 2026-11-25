import { createPrequelUsersIcon } from "./prequel-users.js";

export function createPrequelUsersSolidIcon(root, options = {}) {
  const controller = createPrequelUsersIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
