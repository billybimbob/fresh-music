import { useEffect } from "preact/hooks";
import { Route, Switch, useLocation } from "wouter";

import type { PreloadData } from "@/utils/types.ts";
import { Preload } from "@/utils/client.ts";

import LocationProvider from "@/components/LocationProvider.tsx";
import ArtistDetails from "@/components/pages/ArtistDetails.tsx";
import Search from "@/components/pages/Search.tsx";

import Discover from "@/components/pages/Discover.tsx";
import SongDetails from "@/components/pages/SongDetails.tsx";
import TopArtists from "@/components/pages/TopArtists.tsx";
import TopSongs from "@/components/pages/TopSongs.tsx";

interface MusicRouteProps {
  readonly url?: string;
  readonly initial?: PreloadData;
}

export default function ({ url, initial }: MusicRouteProps) {
  return (
    <LocationProvider url={url}>
      <ClientRouter />
      <MusicRoutes initial={initial} />
    </LocationProvider>
  );
}

function MusicRoutes({ initial = {} }: Pick<MusicRouteProps, "initial">) {
  return (
    <div class="routes">
      <Preload.Provider value={initial}>
        <Switch>
          <Route path="/">
            <Discover />
          </Route>
          <Route path="/top/artists">
            <TopArtists />
          </Route>
          <Route path="/top/songs">
            <TopSongs />
          </Route>

          <Route path="/discover/:genre">
            {({ genre }) => <Discover genre={genre} />}
          </Route>
          <Route path="/search/:query">
            {({ query }) => <Search query={query} />}
          </Route>
          <Route path="/songs/:id">
            {({ id }) => <SongDetails id={id} />}
          </Route>
          <Route path="/artists/:id">
            {({ id }) => <ArtistDetails id={id} />}
          </Route>
        </Switch>
      </Preload.Provider>
    </div>
  );
}

function ClientRouter() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const routeToClient = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
        return;
      }

      const { href = undefined } = e.target as HTMLAnchorElement;
      if (href === undefined) {
        return;
      }

      const url = new URL(href);
      if (url.origin !== location?.origin) {
        return;
      }

      e.preventDefault();
      navigate(href);
    };

    addEventListener("click", routeToClient);

    return () => {
      removeEventListener("click", routeToClient);
    };
  }, [navigate]);

  return null;
}
