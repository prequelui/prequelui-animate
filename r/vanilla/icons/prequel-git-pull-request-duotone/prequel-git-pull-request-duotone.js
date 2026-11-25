import { createPrequelGitPullRequestIcon } from "./prequel-git-pull-request.js";

export function createPrequelGitPullRequestDuotoneIcon(root, options = {}) {
  const controller = createPrequelGitPullRequestIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
