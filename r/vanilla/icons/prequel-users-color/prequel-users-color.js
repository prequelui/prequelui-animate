import { createPrequelUsersIcon } from "./prequel-users.js";

export function createPrequelUsersColorIcon(root, options = {}) {
  const controller = createPrequelUsersIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
