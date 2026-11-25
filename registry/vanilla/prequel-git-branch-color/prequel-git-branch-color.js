import { createPrequelGitBranchIcon } from "./prequel-git-branch.js";

export function createPrequelGitBranchColorIcon(root, options = {}) {
  const controller = createPrequelGitBranchIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
