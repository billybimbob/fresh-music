import { useEffect, useMemo } from "preact/hooks";
import {
  batch,
  computed,
  type ReadonlySignal,
  signal,
  useComputed,
  useSignal,
} from "@preact/signals";
import { type HookReturnValue, useRouter } from "wouter";

export interface LocationSignalHook {
  (options?: { readonly peek?: boolean }): [string, LocationSignalUpdate];
  path: ReadonlySignal<string>;
}

export interface LocationSignal {
  value: string;
}

type LocationSignalUpdate = (to: string, replace?: boolean) => void;

type LocationSignalReturn = HookReturnValue<LocationSignalHook>;

export interface MatchSignal {
  readonly isMatch: boolean;
  readonly params: Record<string, string> | null;
}

export function useLocationSignal(): LocationSignal {
  const { hook } = useRouter();
  const [path, navigate] = hook({ peek: true });

  const { path: source = undefined } = hook as LocationSignalHook;
  const pathSource = useSignal(path);

  useEffect(() => void (pathSource.value = path), [path]);

  return useMemo(() => ({
    get value() {
      return (source ?? pathSource).value;
    },
    set value(to) {
      navigate(to);
    },
  }), [source, pathSource, navigate]);
}

function useUpdatedSignal<T>(value: T) {
  const source = useSignal(value);
  source.value = value;

  return source;
}

export function useRouteSignal(pattern: string): MatchSignal {
  const { matcher } = useRouter();
  const loc = useLocationSignal();

  const patternSource = useUpdatedSignal(pattern);
  const matchSource = useUpdatedSignal(matcher);

  // console.log(pattern === patternSource.value, patternSource.value);

  const match = useComputed(() => {
    return matchSource.value(patternSource.value, loc.value);
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

  const hook = ({ peek = false } = {}) => {
    if (!isListening) {
      addEventListener("popstate", update);
      isListening = true;
    }

    return peek ? tuple.peek() : tuple.value;
  };

  return Object.assign(hook, { path });
}

function navigate(to: string, replace = false) {
  const action = replace ? "replaceState" : "pushState";

  history[action](null, "", to);

  batch(() => void dispatchEvent(new PopStateEvent("popstate")));
}
