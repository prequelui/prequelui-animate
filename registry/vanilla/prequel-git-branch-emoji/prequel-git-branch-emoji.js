import { createPrequelGitBranchIcon } from "./prequel-git-branch.js";

export function createPrequelGitBranchEmojiIcon(root, options = {}) {
  const controller = createPrequelGitBranchIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
