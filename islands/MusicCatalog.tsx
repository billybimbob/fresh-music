import { Preload, PreloadData } from "@/utils/preload.ts";
import { SongQueue, useSongQueueSource } from "@/utils/songQueue.ts";

import MusicRoutes from "@/components/pages/mod.ts";
import SongPlayer from "@/components/player/mod.ts";
import TopPreview from "@/components/TopPreview.tsx";

interface MusicBrowserProps {
  readonly initial?: PreloadData;
}

export default function MusicCatalog({ initial = {} }: MusicBrowserProps) {
  const queue = useSongQueueSource();
  return (
    <SongQueue.Provider value={queue}>
      <Preload.Provider value={initial}>
        <div class="browser-inner">
          <MusicRoutes />
          <TopPreview />
        </div>
      </Preload.Provider>
      <SongPlayer />
    </SongQueue.Provider>
  );
}
