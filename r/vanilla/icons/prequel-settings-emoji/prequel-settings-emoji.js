import { createPrequelSettingsIcon } from "./prequel-settings.js";

export function createPrequelSettingsEmojiIcon(root, options = {}) {
  const controller = createPrequelSettingsIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
