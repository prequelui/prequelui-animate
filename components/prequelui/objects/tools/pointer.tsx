"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Pointer(props: LinObjectProps) {
  return <LinObject object="pointer" {...props} />;
}
