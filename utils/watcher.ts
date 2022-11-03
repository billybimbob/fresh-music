import { type ReadonlySignal, useSignal } from "@preact/signals";

export function useWatcher<T>(value: T): ReadonlySignal<T> {
  const watcher = useSignal(value);
  watcher.value = value;
  return watcher;
}
