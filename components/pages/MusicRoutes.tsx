import Router, { type RouterOnChangeArgs } from "preact-router";
import ArtistDetails from "@/components/pages/ArtistDetails.tsx";
import Discover from "@/components/pages/Discover.tsx";
import Search from "@/components/pages/Search.tsx";
import SongDetails from "@/components/pages/SongDetails.tsx";
import TopArtists from "@/components/pages/TopArtists.tsx";
import TopSongs from "@/components/pages/TopSongs.tsx";

interface MusicRoutesProps {
  onRouteChange(args: RouterOnChangeArgs): void;
}

export default function MusicRoutes({ onRouteChange }: MusicRoutesProps) {
  return (
    <div class="routes">
      <Router onChange={onRouteChange}>
        <Discover path="/" />
        <Discover path="/discover/:genre" />
        <Search path="/search/:query" />
        <SongDetails path="/songs/:id" />
        <ArtistDetails path="/artists/:id" />
        <TopArtists path="/top/artists" />
        <TopSongs path="/top/songs" />
      </Router>
    </div>
  );
}
