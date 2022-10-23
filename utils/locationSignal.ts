import { type JSX } from "preact";
import { useMemo } from "preact/hooks";
import {
  batch,
  computed,
  type ReadonlySignal,
  signal,
  useComputed,
} from "@preact/signals";
import { type BaseLocationHook, type HookReturnValue, useRouter } from "wouter";
import { useWatcher } from "@/utils/signals.ts";

export interface LocationSignal {
  value: string;
}

export interface LocationSignalHook extends BaseLocationHook {
  source: ReadonlySignal<string>;
  dispose(): void;
  (options?: { readonly peek?: boolean }): [string, LocationSignalUpdate];
}

type LocationSignalUpdate = (to: string, replace?: boolean) => void;

type LocationSignalReturn = HookReturnValue<LocationSignalHook>;

export interface MatchSignal {
  readonly isMatch: boolean;
  readonly params: Record<string, string> | null;
}

export function useLocationSignal(): LocationSignal {
  const { hook } = useRouter();
  const { source = undefined } = hook as LocationSignalHook;

  const [path, navigate] = hook({ peek: true });
  const $path = useWatcher(source ?? path);

  return useMemo(() => ({
    get value() {
      return $path.value;
    },
    set value(to) {
      navigate(to);
    },
  }), [$path, navigate]);
}

export function useRouteSignal(
  pattern: string | JSX.SignalLike<string>,
): MatchSignal {
  const { matcher } = useRouter();
  const loc = useLocationSignal();
  const $pattern = useWatcher(pattern);

  // console.log(pattern === $pattern.peek(), $pattern.peek());

  const match = useComputed(() => {
    return matcher($pattern.value, loc.value);
  });

  return useMemo(() => ({
    get isMatch() {
      return match.value[0];
    },
    get params() {
      return match.value[1];
    },
  }), [match]);
}

export function createLocationSignal(): LocationSignalHook {
  const href = signal(location.href);
  const path = computed(() => new URL(href.value).pathname);
  const tuple = computed((): LocationSignalReturn => [path.value, navigate]);

  let isListening = false;

  const update = () => {
    href.value = location.href;
  };

  const hook = (options?: { readonly peek?: boolean }) => {
    if (!isListening) {
      addEventListener("popstate", update);
      isListening = true;
    }

    return options?.peek ? tuple.peek() : tuple.value;
  };

  const dispose = () => {
    if (isListening) {
      console.log("cleaning up popstate");
      removeEventListener("popstate", update);
      isListening = false;
    }
  };

  return Object.assign(hook, { source: path, dispose });
}

function navigate(to: string, replace = false) {
  const action = replace ? "replaceState" : "pushState";

  history[action](null, "", to);

  batch(() => void dispatchEvent(new PopStateEvent("popstate")));
}
