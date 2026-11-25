import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"robot","name":"Robot","category":"AI","parts":[{"tag":"rect","attrs":{"x":5,"y":7,"width":14,"height":11,"rx":3}},{"tag":"path","attrs":{"d":"M12 3v4"}},{"tag":"circle","attrs":{"cx":12,"cy":2.5,"r":1.5}},{"tag":"path","attrs":{"d":"M2 12v3M22 12v3"}},{"tag":"circle","attrs":{"cx":9.5,"cy":12,"r":1}},{"tag":"circle","attrs":{"cx":14.5,"cy":12,"r":1}},{"tag":"path","attrs":{"d":"M9 15.5h6"}}],"roles":["primary","primary","accent","primary","accent","accent","primary"],"closed":[true,false,true,false,true,true,false],"draw":[false,false,false,false,false,false,false],"inside":[false,false,false,false,true,true,true],"hasClosed":true,"highlight":{"cx":9.2,"cy":10.08,"rx":2.2,"ry":1.14},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut","delay":0.08}}},"p3":{},"p4":{},"p5":{},"p6":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.08}}},"p3":{},"p4":{},"p5":{},"p6":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.08}}},"p3":{},"p4":{},"p5":{},"p6":{}}},"component":"PrequelRobotIcon"};

export const meta = {"slug":"robot","name":"Robot","category":"AI","component":"PrequelRobotIcon","style":"outline"};

export function createPrequelRobotIcon(root, options = {}) {
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
