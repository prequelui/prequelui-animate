"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Envelope(props: LinObjectProps) {
  return <LinObject object="envelope" {...props} />;
}
