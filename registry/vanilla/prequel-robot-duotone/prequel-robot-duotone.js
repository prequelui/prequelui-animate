import { createPrequelRobotIcon } from "./prequel-robot.js";

export function createPrequelRobotDuotoneIcon(root, options = {}) {
  const controller = createPrequelRobotIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
