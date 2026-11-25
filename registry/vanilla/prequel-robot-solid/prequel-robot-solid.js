import { createPrequelRobotIcon } from "./prequel-robot.js";

export function createPrequelRobotSolidIcon(root, options = {}) {
  const controller = createPrequelRobotIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
