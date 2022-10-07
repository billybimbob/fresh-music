import Router, { type RouterOnChangeArgs } from "preact-router";
import {
  ArtistDetails,
  Discover,
  Search,
  SongDetails,
  TopArtists,
  TopSongs,
} from "@/components/pages/mod.ts";

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
