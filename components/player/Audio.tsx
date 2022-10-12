import { useRef } from "preact/hooks";
import {
  type ReadonlySignal,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
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
  const queue = useSongQueue();
  const isLoading = useSignal(true);

  useSignalEffect(() => {
    if (isLoading.value) return;

    if (queue.isPlaying) {
      audio.current?.play().catch(console.error);
    } else {
      audio.current?.pause();
    }
  });

  useSignalEffect(() => {
    if (seek.value <= 0) return;
    if (audio.current === null) return;
    if (seek.value > audio.current.duration) return;
    if (seek.value === audio.current.currentTime) return;

    audio.current.currentTime = seek.value;
  });

  const onLoadUpdate = (event: Event) => {
    const { readyState = undefined } = event.target as HTMLAudioElement;

    if (readyState !== undefined) {
      isLoading.value = readyState < 3;
    }
  };

  const onDurationChange = (event: Event) => {
    const { duration = undefined } = event.target as HTMLAudioElement;

    if (duration !== undefined) {
      onDurationFound(duration);
    }
  };

  const onTimeUpdate = (event: Event) => {
    const { currentTime = undefined } = event.target as HTMLAudioElement;

    if (currentTime !== undefined && currentTime !== seek.value) {
      onProgress(currentTime);
    }
  };

  const onEnded = () => {
    if (!loop.value) {
      queue.seekNext();
    }
    if (audio.current !== null) {
      audio.current.currentTime = 0;
    }
  };

  return (
    <audio
      ref={audio}
      src={queue.current?.data}
      volume={volume.value}
      loop={loop.value}
      onLoadStart={onLoadUpdate}
      onCanPlay={onLoadUpdate}
      onCanPlayThrough={onLoadUpdate}
      onDurationChange={onDurationChange}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      controls={false}
      autoPlay={false}
    />
  );
}
