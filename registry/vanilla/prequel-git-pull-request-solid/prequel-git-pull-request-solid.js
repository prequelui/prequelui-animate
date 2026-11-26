import { createPrequelGitPullRequestIcon } from "./prequel-git-pull-request.js";

export function createPrequelGitPullRequestSolidIcon(root, options = {}) {
  const controller = createPrequelGitPullRequestIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
