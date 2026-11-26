import { createPrequelGitCommitIcon } from "./prequel-git-commit.js";

export function createPrequelGitCommitEmojiIcon(root, options = {}) {
  const controller = createPrequelGitCommitIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
