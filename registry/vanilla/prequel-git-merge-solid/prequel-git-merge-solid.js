import { createPrequelGitMergeIcon } from "./prequel-git-merge.js";

export function createPrequelGitMergeSolidIcon(root, options = {}) {
  const controller = createPrequelGitMergeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
