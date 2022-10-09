import { type PreloadData } from "@/utils/preload.ts";
import MusicCatalog from "@/islands/MusicCatalog.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";

interface MusicBrowserProps {
  readonly initial: PreloadData;
}

export default function MusicBrowser({ initial }: MusicBrowserProps) {
  return (
    <main class="music-browser">
      <Navigation />
      <div class="browser-main">
        <SearchBar />
        <MusicCatalog initial={initial} />
      </div>
    </main>
  );
}
