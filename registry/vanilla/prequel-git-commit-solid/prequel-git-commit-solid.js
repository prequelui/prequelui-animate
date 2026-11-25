import { createPrequelGitCommitIcon } from "./prequel-git-commit.js";

export function createPrequelGitCommitSolidIcon(root, options = {}) {
  const controller = createPrequelGitCommitIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
