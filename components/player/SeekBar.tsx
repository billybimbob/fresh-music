import { type ReadonlySignal, useComputed } from "@preact/signals";

interface SeekBarProps {
  readonly progression: ReadonlySignal<number>;
  readonly duration: ReadonlySignal<number>;
  onSeek(seek: number): void;
}

export default function SeekBar(
  { progression, duration, onSeek }: SeekBarProps,
) {
  const passed = useComputed(() => toMinutes(progression.value));
  const limit = useComputed(() => toMinutes(duration.value));

  const previousFive = () => {
    onSeek(Math.max(progression.value - 5, 0));
  };

  const nextFive = () => {
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
      <button class="playback-seek-btn" type="button" onClick={previousFive}>
        -
      </button>
      <p class="playback-time">{passed}</p>
      <input
        title="Playback Slider"
        name="playback-slider"
        class="playback-slider"
        type="range"
        step="any"
        value={progression.value}
        min="0"
        max={duration.value}
        onInput={onInput}
      />
      <p class="playback-time">{limit}</p>
      <button class="playback-seek-btn" type="button" onClick={nextFive}>
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
