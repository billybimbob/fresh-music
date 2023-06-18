import { useRef } from "preact/hooks";
import {
  batch,
  type ReadonlySignal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useSongQueue } from "@/utils/playback/mod.ts";

interface AudioProps {
  seek: ReadonlySignal<number>;
  volume: ReadonlySignal<number>;
  loop: ReadonlySignal<boolean>;
  onProgress: (time: number) => void;
  onDurationFound: (duration: number) => void;
}

export default function Audio(
  { seek, volume, loop, onProgress, onDurationFound }: AudioProps,
) {
  const audio = useRef<HTMLAudioElement>(null);
  const isLoading = useSignal(true);

  const queue = useSongQueue();
  const src = useComputed(() => queue.current?.data ?? "");

  useSignalEffect(() => {
    if (isLoading.value) return;

    if (!queue.isPlaying) {
      audio.current?.pause();
      return;
    }

    audio.current?.play().catch((e) => {
      console.error(e);
      if (queue.isPlaying) {
        queue.toggle();
      }
    });
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

    if (readyState === undefined) return;

    batch(() => {
      isLoading.value = readyState < 3;

      if (readyState === 0) {
        onDurationFound(0);
      }
    });
  };

  const onDurationChange = (event: Event) => {
    const { duration = undefined } = event.target as HTMLAudioElement;

    if (duration !== undefined) {
      onDurationFound(duration);
    }
  };

  const onTimeUpdate = (event: Event) => {
    const { currentTime = undefined } = event.target as HTMLAudioElement;

    if (currentTime !== undefined) {
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
      src={src}
      volume={volume}
      loop={loop}
      controls={false}
      autoPlay={false}
      onLoadStart={onLoadUpdate}
      onCanPlay={onLoadUpdate}
      onCanPlayThrough={onLoadUpdate}
      onDurationChange={onDurationChange}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
    />
  );
}
