import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"braces","name":"Braces","category":"Development","parts":[{"tag":"path","attrs":{"d":"M8 4c-2.5 0-2.5 4-2.5 8s0 8 2.5 8"}},{"tag":"path","attrs":{"d":"M16 4c2.5 0 2.5 4 2.5 8s0 8-2.5 8"}},{"tag":"circle","attrs":{"cx":12,"cy":12,"r":1.2}}],"roles":["primary","primary","primary"],"closed":[false,false,true],"draw":[false,false,false],"inside":[false,false,false],"hasClosed":true,"highlight":null,"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p1":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"x":0},"animate":{"x":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p1":{"initial":{"x":0},"animate":{"x":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p1":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelBracesIcon"};

export const meta = {"slug":"braces","name":"Braces","category":"Development","component":"PrequelBracesIcon","style":"outline"};

export function createPrequelBracesIcon(root, options = {}) {
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
