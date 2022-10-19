import { useContext, useEffect } from "preact/hooks";
import { type ReadonlySignal, useComputed } from "@preact/signals";
import SongQueue from "@/utils/songQueue.ts";

interface SeekBarProps {
  readonly progression: ReadonlySignal<number>;
  readonly duration: ReadonlySignal<number>;
  onSeek(seek: number): void;
}

export default function SeekBar(props: SeekBarProps) {
  const { progression, duration, onSeek } = props;

  const queue = useContext(SongQueue);
  const title = useComputed(() => `Seek ${queue.current?.name ?? "Song"}`);
  const disabled = useComputed(() => queue.current === null);

  const passed = useComputed(() => toMinutes(progression.value));
  const limit = useComputed(() => toMinutes(duration.value));
  const max = useComputed(() => duration.value.toString());

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const { key, shiftKey } = event;

      if (shiftKey || disabled.value) {
        return;
      }

      if (key === "ArrowLeft") {
        onSeek(Math.max(progression.value - 5, 0));
        return;
      }

      if (key === "ArrowRight") {
        onSeek(Math.min(progression.value + 5, duration.value));
        return;
      }
    };

    addEventListener("keyup", onKeyUp);

    return () => {
      removeEventListener("keyup", onKeyUp);
    };
  }, [queue, progression, duration, onSeek]);

  const seekPastFive = () => {
    onSeek(Math.max(progression.value - 5, 0));
  };

  const seekFutureFive = () => {
    onSeek(Math.min(progression.value + 5, duration.value));
  };

  const onInput = (event: Event) => {
    const { valueAsNumber = undefined } = event.target as HTMLInputElement;
    if (valueAsNumber !== undefined) {
      onSeek(valueAsNumber);
    }
  };

  return (
    <div class="playback-seek">
      <button
        title="Previous 5 Seconds"
        type="button"
        class="playback-seek-btn-left"
        disabled={disabled}
        onClick={seekPastFive}
      >
        -
      </button>
      <p class="playback-time">{passed}</p>
      <input
        title={title}
        name="playback-slider"
        class="playback-slider"
        type="range"
        step="any"
        value={progression}
        min="0"
        max={max}
        disabled={disabled}
        onInput={onInput}
      />
      <p class="playback-time">{limit}</p>
      <button
        title="Forward 5 Seconds"
        type="button"
        class="playback-seek-btn-right"
        disabled={disabled}
        onClick={seekFutureFive}
      >
        +
      </button>
    </div>
  );
}

function toMinutes(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
