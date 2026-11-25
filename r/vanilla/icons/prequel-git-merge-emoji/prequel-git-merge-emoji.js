import { createPrequelGitMergeIcon } from "./prequel-git-merge.js";

export function createPrequelGitMergeEmojiIcon(root, options = {}) {
  const controller = createPrequelGitMergeIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
