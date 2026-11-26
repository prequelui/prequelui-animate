// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"stethoscope","name":"Stethoscope","category":"Health","parts":[{"tag":"path","attrs":{"d":"M6 3v6a4 4 0 0 0 8 0V3"}},{"tag":"path","attrs":{"d":"M6 3h1.5M12.5 3H14"}},{"tag":"path","attrs":{"d":"M10 13v3a5 5 0 0 0 10 0v-2"}},{"tag":"circle","attrs":{"cx":20,"cy":12,"r":2.2}}],"roles":["primary","primary","primary","primary"],"closed":[false,false,false,true],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":19.12,"cy":11.03,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0,"transformOrigin":"20% 10%"},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"},"transformOrigin":"20% 10%"}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p3":{}},"tap":{"group":{"initial":{"rotate":0,"transformOrigin":"20% 10%"},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"},"transformOrigin":"20% 10%"}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p3":{}},"loop":{"group":{"initial":{"rotate":0,"transformOrigin":"20% 10%"},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"},"transformOrigin":"20% 10%"}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p3":{}}},"component":"PrequelStethoscopeIcon"};

export function PrequelStethoscopeIcon(props) {
  let host;

  const view = () =>
    renderIcon(spec, {
      size: props.size ?? 28,
      variant: props.variant ?? "outline",
      weight: props.weight ?? "regular",
      className: props.class ?? "",
      label: props.label ?? "",
    });

  onMount(() => {
    const controller = bindPrequelIcon(host, spec, () => ({
      speed: props.speed ?? 1,
      tempo: props.tempo ?? 1,
      delay: props.delay ?? 0,
      loop: props.loop ?? false,
      animate: props.animate ?? false,
      animateOnHover: props.animateOnHover ?? true,
      animateOnTap: props.animateOnTap ?? true,
      animateOnView: props.animateOnView ?? false,
      animateOnViewOnce: props.animateOnViewOnce ?? true,
      animation: props.animation ?? "hover",
    }));
    onCleanup(() => controller.destroy());
  });

  return (
    <span
      ref={host}
      data-slot="prequel-icon-host"
      style={{ display: "contents" }}
      innerHTML={view()}
    />
  );
}
