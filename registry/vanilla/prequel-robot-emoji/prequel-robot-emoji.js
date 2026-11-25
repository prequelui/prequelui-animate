import { createPrequelRobotIcon } from "./prequel-robot.js";

export function createPrequelRobotEmojiIcon(root, options = {}) {
  const controller = createPrequelRobotIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
