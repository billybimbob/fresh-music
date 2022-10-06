import { type Signal, useComputed, useSignal } from "@preact/signals";
import classes from "classNames/index.ts";
import queue from "@/utils/songQueue.ts";

interface PlayButtonsProps {
  readonly loop: Signal<boolean>;
}

export default function PlayButtons({ loop }: PlayButtonsProps) {
  const isShuffled = useSignal(false);

  const loopIcon = useComputed(() =>
    classes({
      "loop-icon": true,
      "loop-icon-active": loop.value,
    })
  );

  const playTitle = useComputed(() => queue.isPlaying ? "Pause" : "Play");

  const playSrc = useComputed(() =>
    queue.isPlaying ? "/pause.svg#pause" : "/play.svg#play"
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
