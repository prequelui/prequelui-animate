import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"sun","name":"Sun","category":"Weather","parts":[{"tag":"circle","attrs":{"cx":12,"cy":12,"r":4}},{"tag":"path","attrs":{"d":"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"}}],"roles":["primary","primary"],"closed":[true,false],"draw":[false,false],"inside":[false,false],"hasClosed":true,"highlight":{"cx":10.4,"cy":10.24,"rx":1.28,"ry":0.7},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,18,0],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut","delay":0.04}}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,180,360],"transition":{"duration":0.8,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.04}}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.04}}}}},"component":"PrequelSunIcon"};

export const meta = {"slug":"sun","name":"Sun","category":"Weather","component":"PrequelSunIcon","style":"outline"};

export function createPrequelSunIcon(root, options = {}) {
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
