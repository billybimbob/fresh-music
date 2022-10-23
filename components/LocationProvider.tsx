import { type ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

import { Router } from "wouter";
import staticLocation from "wouter/static-location";
import {
  createLocationSignal,
  type LocationSignalHook,
} from "@/utils/locationSignal.ts";

interface LocationProps {
  readonly url?: string;
  readonly children: ComponentChildren;
}

export default function LocationProvider({ url, children }: LocationProps) {
  const hook = IS_BROWSER ? createLocationSignal() : staticLocation(url);

  useEffect(() => {
    return () => {
      const { dispose = undefined } = hook as LocationSignalHook;
      if (dispose) dispose();
    };
  }, [hook]);

  return <Router hook={hook}>{children}</Router>;
}
