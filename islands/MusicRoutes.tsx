import { useEffect } from "preact/hooks";
import { Route, Switch } from "wouter";
import { IS_BROWSER } from "$fresh/runtime.ts";

import type { PreloadData } from "@/utils/types.ts";
import { FallbackProvider } from "@/utils/client.ts";
import { useLocationSignal } from "@/utils/location.ts";

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
      <FallbackProvider value={initial}>
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
      </FallbackProvider>
    </div>
  );
}

function ClientRouter() {
  const loc = useLocationSignal();

  useEffect(() => {
    if (!IS_BROWSER) return;

    const routeToClient = (e: MouseEvent) => {
      if (e.ctrlKey) return;
      if (e.metaKey) return;
      if (e.altKey) return;
      if (e.shiftKey) return;
      if (e.button !== 0) return;

      const { closest = undefined } = e.target as Element;
      if (closest === undefined) return;

      const anchor = closest.call(e.target, "a[href]");
      if (anchor === null) return;

      const { origin = undefined, href } = anchor as HTMLAnchorElement;
      if (origin === undefined) return;
      if (origin !== location.origin) return;

      // console.log(e.target, origin, href);

      e.preventDefault();

      loc.value = href;
    };

    addEventListener("click", routeToClient);

    return () => {
      removeEventListener("click", routeToClient);
    };
  }, [loc]);

  return null;
}
