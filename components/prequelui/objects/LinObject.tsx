"use client";

import {
  LinearScene,
  type LinearSceneProps,
} from "./source/scene";
import { getObject } from "./catalog";

export type LinObjectProps = Omit<LinearSceneProps, "scene">;

export function LinObject({
  object,
  ...props
}: LinObjectProps & { object: string }) {
  return <LinearScene scene={getObject(object).scene} {...props} />;
}
