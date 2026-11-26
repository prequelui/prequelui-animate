"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Atom(props: LinObjectProps) {
  return <LinObject object="atom" {...props} />;
}
