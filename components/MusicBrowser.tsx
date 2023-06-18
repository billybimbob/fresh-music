import type { PreloadData } from "@/utils/types.ts";
import { createSource, SongQueueSource } from "@/utils/playback/mod.ts";

import MusicRoutes from "@/islands/MusicRoutes.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";
import SongPlayer from "@/islands/player/SongPlayer.tsx";
import TopPreview from "@/islands/TopPreview.tsx";

interface MusicBrowserProps {
  url: string;
  initial: PreloadData;
  source?: SongQueueSource;
}

export default function MusicBrowser(
  { url, initial, source }: MusicBrowserProps,
) {
  source ??= createSource();
  return (
    <div class="music-browser">
      {/* <Navigation url={url} /> */}
      <main class="browser-main">
        <div class="browser-center">
          {/* <SearchBar /> */}
          <MusicRoutes url={url} initial={initial} source={source} />
        </div>
        {/* <TopPreview initial={initial} source={source} /> */}
        {/* <SongPlayer source={source} /> */}
      </main>
    </div>
  );
}
