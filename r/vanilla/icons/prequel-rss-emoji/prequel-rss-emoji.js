import { createPrequelRssIcon } from "./prequel-rss.js";

export function createPrequelRssEmojiIcon(root, options = {}) {
  const controller = createPrequelRssIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
