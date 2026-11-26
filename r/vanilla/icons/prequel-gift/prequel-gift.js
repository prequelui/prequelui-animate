import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"gift","name":"Gift","category":"Commerce","parts":[{"tag":"rect","attrs":{"x":3,"y":8,"width":18,"height":4,"rx":1.5}},{"tag":"rect","attrs":{"x":5,"y":12,"width":14,"height":9,"rx":1.5}},{"tag":"path","attrs":{"d":"M12 8v13"}},{"tag":"path","attrs":{"d":"M12 8C12 5 10 3 8 3S6 6 9 7l3 1ZM12 8c0-3 2-5 4-5s2 3-1 4l-3 1Z"}}],"roles":["accent","primary","primary","accent"],"closed":[true,true,false,true],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":9.2,"cy":14.52,"rx":1.8,"ry":0.94},"palette":{"color":{"primary":"oklch(0.62 0.14 160)","primaryDark":"oklch(0.8 0.11 160)","accent":"oklch(0.7 0.16 130)","accentDark":"oklch(0.82 0.13 130)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelGiftIcon"};

export const meta = {"slug":"gift","name":"Gift","category":"Commerce","component":"PrequelGiftIcon","style":"outline"};

export function createPrequelGiftIcon(root, options = {}) {
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
