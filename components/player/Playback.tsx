import { useEffect } from "preact/hooks";
import {
  type ReadonlySignal,
  type Signal,
  useComputed,
  useSignal,
} from "@preact/signals";
import classes from "classNames/index.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

interface PlaybackProps {
  readonly loop: Signal<boolean>;
  readonly progression: ReadonlySignal<number>;
  readonly duration: ReadonlySignal<number>;
  onSeek(seek: number): void;
}

export default function Playback(
  { loop, progression, duration, onSeek }: PlaybackProps,
) {
  const queue = useSongQueue();
  const hasSong = useComputed(() => queue.current !== null);

  useEffect(() => {
    // console.log("listening to keyboard");

    const onKeyUp = (event: KeyboardEvent) => {
      const { key, shiftKey } = event;

      if (key === " ") {
        event.stopPropagation();
        event.preventDefault();
        queue.toggle();
        return;
      }

      if (key === "ArrowLeft" && shiftKey && queue.hasPrevious) {
        queue.seekPrevious();
        return;
      }

      if (key === "ArrowRight" && shiftKey && queue.hasNext) {
        queue.seekNext();
        return;
      }

      if (key === "ArrowLeft" && !shiftKey && hasSong.value) {
        onSeek(Math.max(progression.value - 5, 0));
        return;
      }

      if (key === "ArrowRight" && !shiftKey && hasSong.value) {
        onSeek(Math.min(progression.value + 5, duration.value));
        return;
      }
    };

    addEventListener("keyup", onKeyUp);

    return () => {
      removeEventListener("keyup", onKeyUp);
    };
  }, [queue, progression, duration, onSeek]);

  return (
    <div class="playback">
      <PlaybackButtons loop={loop} />
      <SeekBar progression={progression} duration={duration} onSeek={onSeek} />
    </div>
  );
}

type PlaybackButtonProps = Pick<PlaybackProps, "loop">;

function PlaybackButtons({ loop }: PlaybackButtonProps) {
  const isShuffled = useSignal(false);
  const queue = useSongQueue();

  const prevSong = useComputed(() => queue.finished.at(-1)?.name ?? "Previous");
  const currentSong = useComputed(() => queue.current?.name ?? "Song");
  const nextSong = useComputed(() => queue.upcoming.at(0)?.name ?? "Next");

  const isDisabled = useComputed(() => queue.current === null);
  const playTitle = useComputed(() => queue.isPlaying ? "Pause" : "Play");

  const playSrc = useComputed(() =>
    queue.isPlaying ? "/icons/pause.svg#pause" : "/icons/play.svg#play"
  );

  const loopIcon = useComputed(() =>
    classes({
      "loop-icon": true,
      "loop-icon-active": loop.value,
    })
  );

  const toggleLoop = () => {
    loop.value = !loop.value;
  };

  const toPrevious = () => {
    if (queue.hasPrevious) {
      queue.seekPrevious();
    }
  };

  const toNext = () => {
    if (queue.hasNext) {
      queue.seekNext();
    }
  };

  const shuffle = () => {
    if (!isShuffled.value) {
      queue.shuffle();
      isShuffled.value = false;
    }
  };

  return (
    <div class="playback-buttons">
      <button
        title={`Loop ${currentSong}`}
        type="button"
        class="btn-icon"
        disabled={isDisabled.value}
        onClick={toggleLoop}
      >
        <svg class={loopIcon.value}>
          <title>Loop {currentSong}</title>
          <use href="/icons/loop.svg#loop" />
        </svg>
      </button>

      <button
        title={`To ${prevSong}`}
        type="button"
        class="btn-icon"
        disabled={isDisabled.value}
        onClick={toPrevious}
      >
        <svg class="seek-icon">
          <title>To {prevSong}</title>
          <use href="/icons/previous.svg#previous" />
        </svg>
      </button>

      <button
        title={`${playTitle} ${currentSong}`}
        type="button"
        class="btn-icon"
        disabled={isDisabled.value}
        onClick={queue.toggle}
      >
        <svg class="play-icon">
          <title>{playTitle} {currentSong}</title>
          <use href={playSrc.value} />
        </svg>
      </button>

      <button
        title={`To ${nextSong}`}
        type="button"
        class="btn-icon"
        disabled={isDisabled.value}
        onClick={toNext}
      >
        <svg class="seek-icon">
          <title>To {nextSong}</title>
          <use href="/icons/next.svg#next" />
        </svg>
      </button>

      <button
        title="Shuffle"
        type="button"
        class="btn-icon"
        disabled={isDisabled.value}
        onClick={shuffle}
      >
        <svg class="shuffle-icon">
          <title>Shuffle</title>
          <use href="/icons/shuffle.svg#shuffle" />
        </svg>
      </button>
    </div>
  );
}

type SeekBarProps = Omit<PlaybackProps, "loop">;

function SeekBar({ progression, duration, onSeek }: SeekBarProps) {
  const queue = useSongQueue();
  const currentSong = useComputed(() => queue.current?.name ?? "Song");
  const isDisabled = useComputed(() => queue.current === null);

  const passed = useComputed(() => toMinutes(progression.value));
  const limit = useComputed(() => toMinutes(duration.value));

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
        disabled={isDisabled.value}
        onClick={seekPastFive}
      >
        -
      </button>
      <p class="playback-time">{passed}</p>
      <input
        title={`Seek ${currentSong}`}
        name="playback-slider"
        class="playback-slider"
        type="range"
        step="any"
        value={progression.value}
        min="0"
        max={duration.value}
        disabled={isDisabled.value}
        onInput={onInput}
      />
      <p class="playback-time">{limit}</p>
      <button
        title="Forward 5 Seconds"
        type="button"
        class="playback-seek-btn-right"
        disabled={isDisabled.value}
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
