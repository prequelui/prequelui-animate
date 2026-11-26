"use client";

import { LinObject, type LinObjectProps } from "../LinObject";

export function Book(props: LinObjectProps) {
  return <LinObject object="book" {...props} />;
}
