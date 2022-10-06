import Router from "preact-router";
import type { Track } from "@/utils/types.ts";
import { useInitialPreload } from "@/utils/preload.ts";
import {
  ArtistDetails,
  Discover,
  Search,
  SongDetails,
  TopArtists,
  TopSongs,
} from "@/components/pages/mod.ts";

interface MusicRoutesProps {
  readonly charts?: readonly Track[];
  readonly genre?: readonly Track[];
}

export default function MusicRoutes({ charts, genre }: MusicRoutesProps) {
  const clear = useInitialPreload(charts, genre);
  return (
    <div class="routes">
      <Router onChange={clear}>
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
