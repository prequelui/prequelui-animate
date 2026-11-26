import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"scale","name":"Scale","category":"Commerce","parts":[{"tag":"path","attrs":{"d":"M12 3v18"}},{"tag":"path","attrs":{"d":"M6 21h12"}},{"tag":"path","attrs":{"d":"M5 7h14"}},{"tag":"polygon","attrs":{"points":"5,7 2,13 8,13"}},{"tag":"polygon","attrs":{"points":"19,7 16,13 22,13"}}],"roles":["primary","primary","primary","primary","accent"],"closed":[false,false,false,true,true],"draw":[false,false,false,false,false],"inside":[false,false,false,false,false],"hasClosed":true,"highlight":{"cx":3.8,"cy":8.68,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.62 0.14 160)","primaryDark":"oklch(0.8 0.11 160)","accent":"oklch(0.7 0.16 130)","accentDark":"oklch(0.82 0.13 130)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p4":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p4":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p4":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelScaleIcon"};

export const meta = {"slug":"scale","name":"Scale","category":"Commerce","component":"PrequelScaleIcon","style":"outline"};

export function createPrequelScaleIcon(root, options = {}) {
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
