import { asset } from "$fresh/runtime.ts";
import { type Signal, useComputed } from "@preact/signals";
import classes from "classnames";
import { useSongQueue } from "@/utils/songQueue.ts";

interface LoopProps {
  readonly value: Signal<boolean>;
}

export default function Loop({ value: loop }: LoopProps) {
  const queue = useSongQueue();
  const title = useComputed(() => `Loop ${queue.current?.name ?? "Song"}`);
  const disabled = useComputed(() => queue.current === null);

  const icon = useComputed(() =>
    classes({
      "loop-icon": true,
      "active": loop.value,
    })
  );

  const toggle = () => {
    loop.value = !loop.value;
  };

  return (
    <button
      title={title}
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={toggle}
    >
      <svg class={icon}>
        <title>{title}</title>
        <use href={asset("/icons/loop.svg#loop")} />
      </svg>
    </button>
  );
}
