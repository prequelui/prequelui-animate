import { createPrequelGitMergeIcon } from "./prequel-git-merge.js";

export function createPrequelGitMergeColorIcon(root, options = {}) {
  const controller = createPrequelGitMergeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
