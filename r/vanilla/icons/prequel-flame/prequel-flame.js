import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"flame","name":"Flame","category":"Nature","parts":[{"tag":"path","attrs":{"d":"M12 22c4 0 7-2.7 7-7 0-6-7-13-7-13S5 9 5 15c0 4.3 3 7 7 7Z"}},{"tag":"path","attrs":{"d":"M12 18c1.7 0 3-1.3 3-3 0-2.2-3-5-3-5s-3 2.8-3 5c0 1.7 1.3 3 3 3Z"}}],"roles":["primary","accent"],"closed":[true,true],"draw":[false,false],"inside":[false,true],"hasClosed":true,"highlight":{"cx":9.2,"cy":7.6,"rx":2.24,"ry":1.16},"palette":{"color":{"primary":"oklch(0.6 0.15 145)","primaryDark":"oklch(0.79 0.12 145)","accent":"oklch(0.74 0.16 95)","accentDark":"oklch(0.86 0.13 95)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.05,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.15,1],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelFlameIcon"};

export const meta = {"slug":"flame","name":"Flame","category":"Nature","component":"PrequelFlameIcon","style":"outline"};

export function createPrequelFlameIcon(root, options = {}) {
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
