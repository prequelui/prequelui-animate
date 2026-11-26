import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"fog","name":"Fog","category":"Weather","parts":[{"tag":"path","attrs":{"d":"M6.5 11h10a3.2 3.2 0 0 0 .4-6.4A5 5 0 0 0 7.4 4 3.8 3.8 0 0 0 6.5 11Z"}},{"tag":"path","attrs":{"d":"M4 15h16"}},{"tag":"path","attrs":{"d":"M6 18h12"}},{"tag":"path","attrs":{"d":"M4 21h10"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,true,false,false],"hasClosed":true,"highlight":{"cx":7.71,"cy":3.5,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.05}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.1}}}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"x":0},"animate":{"x":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.05}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.1}}}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.05}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.1}}}}},"component":"PrequelFogIcon"};

export const meta = {"slug":"fog","name":"Fog","category":"Weather","component":"PrequelFogIcon","style":"outline"};

export function createPrequelFogIcon(root, options = {}) {
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
