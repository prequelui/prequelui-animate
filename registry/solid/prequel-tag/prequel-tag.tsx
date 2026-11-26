// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"tag","name":"Tag","category":"Commerce","parts":[{"tag":"path","attrs":{"d":"M20 13l-7 7-9-9V4h7l9 9Z"}},{"tag":"circle","attrs":{"cx":8,"cy":8,"r":1.4}}],"roles":["primary","accent"],"closed":[true,true],"draw":[false,false],"inside":[false,true],"hasClosed":true,"highlight":{"cx":8.8,"cy":8.48,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.14 160)","primaryDark":"oklch(0.8 0.11 160)","accent":"oklch(0.7 0.16 130)","accentDark":"oklch(0.82 0.13 130)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0,"transformOrigin":"8px 8px"},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"},"transformOrigin":"8px 8px"}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0,"transformOrigin":"8px 8px"},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"},"transformOrigin":"8px 8px"}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"rotate":0,"transformOrigin":"8px 8px"},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"},"transformOrigin":"8px 8px"}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelTagIcon"};

export function PrequelTagIcon(props) {
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
