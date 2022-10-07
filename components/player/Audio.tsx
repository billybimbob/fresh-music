import {
  type ReadonlySignal,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useRef } from "preact/hooks";
import { useSongQueue } from "@/utils/songQueue.ts";

interface AudioProps {
  readonly seek: ReadonlySignal<number>;
  readonly volume: ReadonlySignal<number>;
  readonly loop: ReadonlySignal<boolean>;
  onProgress(time: number): void;
  onDurationFound(duration: number): void;
}

export default function Audio(
  { seek, volume, loop, onProgress, onDurationFound }: AudioProps,
) {
  const audio = useRef<HTMLAudioElement>(null);
  const isPaused = useSignal(audio.current?.paused ?? true);
  const queue = useSongQueue();

  useSignalEffect(() => {
    if (audio.current === null) return;
    if (isPaused.value !== queue.isPlaying) return;

    if (!queue.isPlaying) {
      audio.current.pause();
      return;
    }

    audio.current.play()
      .catch(() => {
        if (queue.isPlaying) {
          queue.toggle();
        }
      });
  });

  useSignalEffect(() => {
    if (audio.current === null) return;
    if (seek.value <= 0 || seek.value > audio.current.duration) return;

    audio.current.currentTime = seek.value;
  });

  const onPausedUpdate = (event: Event) => {
    const { paused = undefined } = event.target as HTMLAudioElement;
    if (paused !== undefined) {
      isPaused.value = paused;
    }
  };

  const onEnded = () => {
    if (audio.current === null) return;
    if (loop) return;

    queue.seekNext();

    if (!queue.isPlaying) return;

    audio.current.play()
      .catch(() => {
        if (queue.isPlaying) {
          queue.toggle();
        }
      });
  };

  const onTimeUpdate = (event: Event) => {
    const { currentTime = undefined } = event.target as HTMLAudioElement;

    if (currentTime !== undefined && currentTime !== seek.value) {
      onProgress(currentTime);
    }
  };

  const onDurationChange = (event: Event) => {
    const { duration = undefined } = event.target as HTMLAudioElement;
    if (duration !== undefined) {
      onDurationFound(duration);
    }
  };

  return (
    <audio
      ref={audio}
      src={queue.current?.data}
      volume={volume.value}
      loop={loop.value}
      onPause={onPausedUpdate}
      onPlay={onPausedUpdate}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onDurationChange={onDurationChange}
      controls={false}
      autoPlay={false}
    />
  );
}
