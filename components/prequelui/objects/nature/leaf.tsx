"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Leaf(props: LinObjectProps) {
  return <LinObject object="leaf" {...props} />;
}
