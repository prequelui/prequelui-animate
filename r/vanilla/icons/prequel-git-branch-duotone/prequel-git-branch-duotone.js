import { createPrequelGitBranchIcon } from "./prequel-git-branch.js";

export function createPrequelGitBranchDuotoneIcon(root, options = {}) {
  const controller = createPrequelGitBranchIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
