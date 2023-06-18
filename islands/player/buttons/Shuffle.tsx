import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useSongQueue } from "@/utils/playback/mod.ts";

export default function Shuffle() {
  const queue = useSongQueue();
  const disabled = useComputed(() => queue.current === null || !queue.hasNext);

  return (
    <button
      title="Shuffle"
      type="button"
      class="btn-icon shuffle"
      disabled={disabled}
      onClick={queue.shuffle}
    >
      <svg class="shuffle-icon">
        <title>Shuffle</title>
        <use href={asset("/icons/shuffle.svg#shuffle")} />
      </svg>
    </button>
  );
}
