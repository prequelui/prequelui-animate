import { createPrequelBikeIcon } from "./prequel-bike.js";

export function createPrequelBikeEmojiIcon(root, options = {}) {
  const controller = createPrequelBikeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
