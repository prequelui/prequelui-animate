// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"git-pull-request","name":"Git Pull Request","category":"Development","parts":[{"tag":"circle","attrs":{"cx":6,"cy":6,"r":2.5}},{"tag":"circle","attrs":{"cx":6,"cy":18,"r":2.5}},{"tag":"circle","attrs":{"cx":18,"cy":18,"r":2.5}},{"tag":"path","attrs":{"d":"M6 8.5v7"}},{"tag":"path","attrs":{"d":"M18 15.5V9a3 3 0 0 0-3-3h-4M13 4l-2 2 2 2"}}],"roles":["primary","accent","accent","primary","primary"],"closed":[true,true,true,false,false],"draw":[false,false,false,false,false],"inside":[false,false,false,false,false],"hasClosed":true,"highlight":{"cx":5,"cy":4.9,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut","delay":0.06}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p4":{}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,-5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.06}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p4":{}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,-2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.06}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p4":{}}},"component":"PrequelGitPullRequestIcon"};

export function PrequelGitPullRequestIcon(props) {
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
