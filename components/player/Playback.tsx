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

      if (key === "ArrowLeft" && hasSong.value) {
        onSeek(Math.max(progression.value - 5, 0));
        return;
      }

      if (key === "ArrowRight" && hasSong.value) {
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

  const playTitle = useComputed(() => queue.isPlaying ? "Pause" : "Play");

  const playSrc = useComputed(() =>
    queue.isPlaying ? "/pause.svg#pause" : "/play.svg#play"
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
      <svg class={loopIcon.value} onClick={toggleLoop}>
        <title>Loop Song</title>
        <use href="/loop.svg#loop" />
      </svg>

      <svg class="seek-icon" onClick={toPrevious}>
        <title>Seek Previous</title>
        <use href="/previous.svg#previous" />
      </svg>

      <svg class="play-icon" onClick={queue.toggle}>
        <title>{playTitle}</title>
        <use href={playSrc.value} />
      </svg>

      <svg class="seek-icon" onClick={toNext}>
        <title>Seek Next</title>
        <use href="/next.svg#next" />
      </svg>

      <svg class="shuffle-icon" onClick={shuffle}>
        <title>Shuffle</title>
        <use href="/shuffle.svg#shuffle" />
      </svg>
    </div>
  );
}

type SeekBarProps = Omit<PlaybackProps, "loop">;

function SeekBar({ progression, duration, onSeek }: SeekBarProps) {
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
      <button
        class="playback-seek-btn-left"
        type="button"
        onClick={previousFive}
      >
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
      <button class="playback-seek-btn-right" type="button" onClick={nextFive}>
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
