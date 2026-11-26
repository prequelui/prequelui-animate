import { createPrequelRobotIcon } from "./prequel-robot.js";

export function createPrequelRobotColorIcon(root, options = {}) {
  const controller = createPrequelRobotIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
