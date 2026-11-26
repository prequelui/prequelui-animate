import { createPrequelUsersIcon } from "./prequel-users.js";

export function createPrequelUsersDuotoneIcon(root, options = {}) {
  const controller = createPrequelUsersIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
