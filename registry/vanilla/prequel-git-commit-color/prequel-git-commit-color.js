import { createPrequelGitCommitIcon } from "./prequel-git-commit.js";

export function createPrequelGitCommitColorIcon(root, options = {}) {
  const controller = createPrequelGitCommitIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
