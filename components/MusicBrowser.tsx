import { type PreloadData } from "@/utils/preload.ts";

import Navigation from "@/islands/Navigation.tsx";
import MusicRoutes from "@/islands/MusicRoutes.tsx";
import SearchBar from "@/islands/SearchBar.tsx";
import SongPlayer from "@/islands/SongPlayer.tsx";
import TopPreview from "@/islands/TopPreview.tsx";

interface MusicBrowserProps {
  readonly initial: PreloadData;
}

export default function MusicBrowser({ initial }: MusicBrowserProps) {
  return (
    <div class="music-browser">
      <Navigation />
      <main class="browser-main">
        <SearchBar />
        <MusicRoutes initial={initial} />
        <TopPreview initial={initial} />
        <SongPlayer />
      </main>
    </div>
  );
}
