import {
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Shuffle() {
  const isShuffled = useSignal(false);
  const queue = useSongQueue();

  const disabled = useComputed(() =>
    isShuffled.value || queue.current === null
  );

  useSignalEffect(() => {
    isShuffled.value = queue.finished.length > 0 && isShuffled.peek();
  });

  const shuffle = () => {
    batch(() => {
      queue.shuffle();
      isShuffled.value = true;
    });
  };

  return (
    <button
      title="Shuffle"
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={shuffle}
    >
      <svg class="shuffle-icon">
        <title>Shuffle</title>
        <use href="/icons/shuffle.svg#shuffle" />
      </svg>
    </button>
  );
}
