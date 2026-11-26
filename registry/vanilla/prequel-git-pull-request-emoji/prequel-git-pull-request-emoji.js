import { createPrequelGitPullRequestIcon } from "./prequel-git-pull-request.js";

export function createPrequelGitPullRequestEmojiIcon(root, options = {}) {
  const controller = createPrequelGitPullRequestIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
