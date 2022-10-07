import { type RouterOnChangeArgs } from "preact-router";

import type { Track } from "@/utils/types.ts";
import { Preload, usePreloadSource } from "@/utils/preload.ts";
import { SongState, useSongQueueSource } from "@/utils/songQueue.ts";

import MusicRoutes from "@/components/pages/mod.ts";
import SongPlayer from "@/components/player/mod.ts";
import TopPreview from "@/components/TopPreview.tsx";

interface MusicBrowserProps {
  readonly charts?: readonly Track[];
  readonly genre?: readonly Track[];
}

export default function MusicBrowser({ charts, genre }: MusicBrowserProps) {
  const queue = useSongQueueSource();
  const preload = usePreloadSource(charts, genre);

  const onRouteChange = (args: RouterOnChangeArgs) => {
    if (args.previous !== undefined) {
      preload.clear();
    }
  };

  return (
    <SongState.Provider value={queue}>
      <Preload.Provider value={preload}>
        <div class="browser-inner">
          <MusicRoutes onRouteChange={onRouteChange} />
          <TopPreview />
        </div>
      </Preload.Provider>
      <SongPlayer />
    </SongState.Provider>
  );
}
