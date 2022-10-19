import { type ComponentChildren } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Router } from "wouter";
import staticLocation from "wouter/static-location";
import { createLocationSignal } from "@/utils/locationSignal.ts";

interface LocationProps {
  readonly url?: string;
  readonly children: ComponentChildren;
}

export default function LocationProvider({ url, children }: LocationProps) {
  const hook = IS_BROWSER ? createLocationSignal() : staticLocation(url);

  return <Router hook={hook}>{children}</Router>;
}
