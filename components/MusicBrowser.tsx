import type { PreloadData } from "@/utils/types.ts";

import Navigation from "@/islands/Navigation.tsx";
import MusicRoutes from "@/islands/MusicRoutes.tsx";
import SearchBar from "@/islands/SearchBar.tsx";
import SongPlayer from "@/islands/SongPlayer.tsx";
import TopPreview from "@/islands/TopPreview.tsx";

interface MusicBrowserProps {
  readonly url: string;
  readonly initial: PreloadData;
}

export default function MusicBrowser({ url, initial }: MusicBrowserProps) {
  return (
    <div class="music-browser">
      <Navigation url={url} />
      <main class="browser-main">
        <SearchBar url={url} />
        <MusicRoutes url={url} initial={initial} />
        <TopPreview initial={initial} />
        <SongPlayer />
      </main>
    </div>
  );
}
