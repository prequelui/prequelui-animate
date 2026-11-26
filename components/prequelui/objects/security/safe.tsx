"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Safe(props: LinObjectProps) {
  return <LinObject object="safe" {...props} />;
}
