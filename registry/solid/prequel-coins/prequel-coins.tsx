// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"coins","name":"Coins","category":"Finance","parts":[{"tag":"ellipse","attrs":{"cx":12,"cy":6.5,"rx":6,"ry":2.6}},{"tag":"ellipse","attrs":{"cx":12,"cy":12,"rx":6,"ry":2.6}},{"tag":"ellipse","attrs":{"cx":12,"cy":17.5,"rx":6,"ry":2.6}},{"tag":"path","attrs":{"d":"M6 6.5v11M18 6.5v11"}}],"roles":["accent","accent","primary","primary"],"closed":[true,true,true,false],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":9.6,"cy":16.36,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.04}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.08}}},"p3":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1],"delay":0.04}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1],"delay":0.08}}},"p3":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.04}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.08}}},"p3":{}}},"component":"PrequelCoinsIcon"};

export function PrequelCoinsIcon(props) {
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
