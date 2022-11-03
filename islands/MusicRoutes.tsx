import { Route, Router } from "preact-router";
import { IS_BROWSER } from "$fresh/runtime.ts";

import type { PreloadData } from "@/utils/types.ts";
import { FallbackProvider } from "@/utils/client.ts";

import ArtistDetails from "@/components/pages/ArtistDetails.tsx";
import Search from "@/components/pages/Search.tsx";

import Discover from "@/components/pages/Discover.tsx";
import SongDetails from "@/components/pages/SongDetails.tsx";
import TopArtists from "@/components/pages/TopArtists.tsx";
import TopSongs from "@/components/pages/TopSongs.tsx";

interface MusicRouteProps {
  url?: string;
  initial?: PreloadData;
}

export default function MusicRoutes({ url, initial = {} }: MusicRouteProps) {
  return (
    <div class="routes">
      <FallbackProvider value={initial}>
        <Router url={IS_BROWSER ? undefined : url} static={!IS_BROWSER}>
          <Route path="/" component={Discover} />
          <Route path="/discover/:genre" component={Discover} />
          <Route path="/top/artists" component={TopArtists} />
          <Route path="/top/songs" component={TopSongs} />
          <Route path="/search/:query" component={Search} />
          <Route path="/songs/:id" component={SongDetails} />
          <Route path="/artists/:id" component={ArtistDetails} />
        </Router>
      </FallbackProvider>
    </div>
  );
}
