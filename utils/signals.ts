import { type JSX } from "preact";
import { useMemo } from "preact/hooks";
import { type ReadonlySignal, type Signal, signal } from "@preact/signals";

export function useWatcher<T>(value: T | JSX.SignalLike<T>): ReadonlySignal<T> {
  const watcher = useMemo(() => new Watcher(value), []);

  watcher.update(value);

  return watcher.source;
}

class Watcher<T> {
  #controlled: boolean;
  #primitive?: Signal<T>;
  readonly #source: Signal<JSX.SignalLike<T>>;

  constructor(value: T | JSX.SignalLike<T>) {
    if (isSignal(value)) {
      this.#controlled = false;
      this.#source = signal(value);
    } else {
      this.#controlled = true;
      this.#primitive = signal(value);
      this.#source = signal(this.#primitive);
    }
  }

  get source() {
    return this.#source.value as ReadonlySignal<T>;
  }

  update(value: T | JSX.SignalLike<T>) {
    if (this.#primitive?.peek() === value || this.#source.peek() === value) {
      return;
    }

    if (isSignal(value)) {
      this.#controlled = false;
      this.#source.value = value;
      return;
    }

    this.#primitive ??= signal(value);
    this.#primitive.value = value;

    if (!this.#controlled) {
      this.#controlled = true;
      this.#source.value = this.#primitive;
    }
  }
}

function isSignal<T>(value: T | JSX.SignalLike<T>): value is JSX.SignalLike<T> {
  return value && typeof value === "object" &&
    "value" in value && "peek" in value;
}
