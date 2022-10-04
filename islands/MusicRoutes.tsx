import Router from "preact-router";
import {
  ArtistDetails,
  Discover,
  Search,
  SongDetails,
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
      </Router>
    </div>
  );
}
