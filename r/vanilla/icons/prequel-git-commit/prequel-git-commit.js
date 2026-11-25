import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"git-commit","name":"Git Commit","category":"Development","parts":[{"tag":"circle","attrs":{"cx":12,"cy":12,"r":3.5}},{"tag":"path","attrs":{"d":"M3 12h5.5M15.5 12H21"}}],"roles":["primary","primary"],"closed":[true,false],"draw":[false,false],"inside":[false,false],"hasClosed":true,"highlight":{"cx":10.6,"cy":10.46,"rx":1.12,"ry":0.7},"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"12px 12px"}},"p1":{}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"12px 12px"}},"p1":{}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"12px 12px"}},"p1":{}}},"component":"PrequelGitCommitIcon"};

export const meta = {"slug":"git-commit","name":"Git Commit","category":"Development","component":"PrequelGitCommitIcon","style":"outline"};

export function createPrequelGitCommitIcon(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderIcon(spec, current);
  };
  render();
  const controller = bindPrequelIcon(root, spec, () => current);
  return {
    play: controller.play,
    reset: controller.reset,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
    get observed() {
      return controller.observed;
    },
  };
}
