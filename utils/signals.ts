import { type JSX } from "preact";
import { useMemo } from "preact/hooks";
import { type ReadonlySignal, signal } from "@preact/signals";

export function useWatcher<T>(value: T | JSX.SignalLike<T>): ReadonlySignal<T> {
  const watcher = useMemo(() => new Watcher(value), []);

  watcher.update(value);

  return watcher.source;
}

class Watcher<T> {
  #controlled!: boolean;
  #source!: JSX.SignalLike<T>;

  constructor(value: T | JSX.SignalLike<T>) {
    if (isSignal(value)) {
      this.#watch(value);
    } else {
      this.#control(value);
    }
  }

  get source() {
    return this.#source as ReadonlySignal<T>;
  }

  update(value: T | JSX.SignalLike<T>) {
    if (this.#source === value) {
      return;
    }

    if (isSignal(value)) {
      throw new Error("Watching singal modified");
    }

    if (!this.#controlled) {
      this.#control(value);
      return;
    }

    this.#source.value = value;
  }

  #control(value: T) {
    this.#controlled = true;
    this.#source = signal(value);
  }

  #watch(value: JSX.SignalLike<T>) {
    this.#controlled = false;
    this.#source = value;
  }
}

function isSignal<T>(value: T | JSX.SignalLike<T>): value is JSX.SignalLike<T> {
  return (value as JSX.SignalLike<T>)?.peek !== undefined;
}
