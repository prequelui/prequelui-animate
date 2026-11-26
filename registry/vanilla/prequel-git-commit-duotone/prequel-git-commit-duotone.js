import { createPrequelGitCommitIcon } from "./prequel-git-commit.js";

export function createPrequelGitCommitDuotoneIcon(root, options = {}) {
  const controller = createPrequelGitCommitIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
