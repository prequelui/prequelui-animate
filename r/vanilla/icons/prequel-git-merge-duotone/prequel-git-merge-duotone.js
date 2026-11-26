import { createPrequelGitMergeIcon } from "./prequel-git-merge.js";

export function createPrequelGitMergeDuotoneIcon(root, options = {}) {
  const controller = createPrequelGitMergeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
