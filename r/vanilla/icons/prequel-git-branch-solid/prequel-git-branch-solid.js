import { createPrequelGitBranchIcon } from "./prequel-git-branch.js";

export function createPrequelGitBranchSolidIcon(root, options = {}) {
  const controller = createPrequelGitBranchIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
