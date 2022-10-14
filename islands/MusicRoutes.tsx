import Router from "preact-router";
import { Preload, type PreloadData } from "@/utils/preload.ts";

import ArtistDetails from "@/components/pages/ArtistDetails.tsx";
import Discover from "@/components/pages/Discover.tsx";
import Search from "@/components/pages/Search.tsx";
import SongDetails from "@/components/pages/SongDetails.tsx";
import TopArtists from "@/components/pages/TopArtists.tsx";
import TopSongs from "@/components/pages/TopSongs.tsx";

// const pageTitles = new Map([
//   [Discover.name, "Discover Music"],
//   [Search.name, "Search Music"],
//   [SongDetails.name, "Song Details"],
//   [ArtistDetails.name, "Artist Details"],
//   [TopArtists.name, "Top Artists"],
//   [TopSongs.name, "Top Songs"],
// ]);

interface MusicRouteProps {
  readonly initial?: PreloadData;
}

export default function MusicRoutes({ initial = {} }: MusicRouteProps) {
  // const title = useSignal(defaultTitle);

  // const onRouteChange = (args: RouterOnChangeArgs) => {
  //   const { type } = args.current;
  //   const displayName = typeof type === "string" ? type : type.name;

  //   title.value = pageTitles.get(displayName) ?? defaultTitle;
  // };

  return (
    <Preload.Provider value={initial}>
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
    </Preload.Provider>
  );
}
