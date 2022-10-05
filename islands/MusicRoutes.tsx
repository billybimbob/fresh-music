import Router from "preact-router";
import {
  ArtistDetails,
  Discover,
  Search,
  SongDetails,
  TopArtists,
  TopSongs,
} from "@/components/pages/mod.ts";

export default function MusicRoutes() {
  return (
    <div class="routes">
      <Router>
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
