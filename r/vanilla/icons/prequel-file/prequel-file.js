import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"file","name":"File","category":"Files","parts":[{"tag":"path","attrs":{"d":"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"}},{"tag":"path","attrs":{"d":"M14 3v5h5"}},{"tag":"path","attrs":{"d":"M9 14h6"}},{"tag":"path","attrs":{"d":"M9 17h4"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,true,true,true],"hasClosed":true,"highlight":{"cx":8.4,"cy":8.6,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.13 230)","primaryDark":"oklch(0.8 0.1 230)","accent":"oklch(0.7 0.14 205)","accentDark":"oklch(0.82 0.11 205)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut","delay":0.05}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.05}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p3":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.05}}}}},"component":"PrequelFileIcon"};

export const meta = {"slug":"file","name":"File","category":"Files","component":"PrequelFileIcon","style":"outline"};

export function createPrequelFileIcon(root, options = {}) {
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
