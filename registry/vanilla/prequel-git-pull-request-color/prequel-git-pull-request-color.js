import { createPrequelGitPullRequestIcon } from "./prequel-git-pull-request.js";

export function createPrequelGitPullRequestColorIcon(root, options = {}) {
  const controller = createPrequelGitPullRequestIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
