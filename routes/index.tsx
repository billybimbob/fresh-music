import MusicRoutes from "@/islands/MusicRoutes.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";
import SongPlayer from "@/islands/SongPlayer.tsx";
import TopPreview from "@/islands/TopPreview.tsx";

export default function Home() {
  return (
    <main class="music-browser">
      <Navigation />
      <div class="browser-main">
        <SearchBar />
        <div class="browser-inner">
          <MusicRoutes />
          <TopPreview />
        </div>
      </div>
      <SongPlayer />
    </main>
  );
}
