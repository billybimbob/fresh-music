import { useSignal } from "@preact/signals";

import Audio from "@/islands/player/Audio.tsx";
import Controls from "@/islands/player/Controls.tsx";
import NowPlaying from "@/islands/player/NowPlaying.tsx";
import SeekBar from "@/islands/player/SeekBar.tsx";
import Volume from "@/islands/player/Volume.tsx";

import {
  SongQueueProvider,
  type SongQueueSource,
} from "@/utils/playback/mod.ts";

interface SongPlayerProps {
  source: SongQueueSource;
}

export default function SongPlayer({ source }: SongPlayerProps) {
  const progression = useSignal(0);
  const duration = useSignal(0);
  const volume = useSignal(0);
  const seek = useSignal(0);
  const loop = useSignal(false);

  const onSeek = (value: number) => {
    seek.value = value;
  };

  const onProgress = (value: number) => {
    progression.value = value;
  };

  const onDurationFound = (value: number) => {
    duration.value = value;
  };

  return (
    <SongQueueProvider source={source}>
      <aside class="song-player">
        <NowPlaying />
        <div class="playback">
          <Controls loop={loop} />
          <SeekBar
            progression={progression}
            duration={duration}
            onSeek={onSeek}
          />
        </div>
        <Audio
          volume={volume}
          seek={seek}
          loop={loop}
          onProgress={onProgress}
          onDurationFound={onDurationFound}
        />
        <Volume volume={volume} />
      </aside>
    </SongQueueProvider>
  );
}
