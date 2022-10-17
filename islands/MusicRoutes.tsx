import { Route, Router } from "preact-router";
import { Preload, type PreloadData } from "@/utils/preload.ts";

import ArtistDetails from "@/components/pages/ArtistDetails.tsx";
import Discover from "@/components/pages/Discover.tsx";
import Search from "@/components/pages/Search.tsx";
import SongDetails from "@/components/pages/SongDetails.tsx";
import TopArtists from "@/components/pages/TopArtists.tsx";
import TopSongs from "@/components/pages/TopSongs.tsx";

interface MusicRouteProps {
  readonly initial?: PreloadData;
}

export default function MusicRoutes({ initial = {} }: MusicRouteProps) {
  return (
    <Preload.Provider value={initial}>
      <div class="routes">
        <Router>
          <Route path="/" component={Discover} />
          <Route path="/discover/:genre" component={Discover} />
          <Route path="/search/:query" component={Search} />
          <Route path="/songs/:id" component={SongDetails} />
          <Route path="/artists/:id" component={ArtistDetails} />
          <Route path="/top/artists" component={TopArtists} />
          <Route path="/top/songs" component={TopSongs} />
        </Router>
      </div>
    </Preload.Provider>
  );
}
