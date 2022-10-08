import { useComputed } from "@preact/signals";
import { RoutableProps } from "preact-router";
import { useCharts } from "@/utils/client.ts";
import { usePreload } from "@/utils/preload.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopArtists(_props: RoutableProps) {
  const preload = usePreload();
  const response = useCharts(preload.charts !== undefined);
  const songs = useComputed(() => preload.charts ?? response.data);

  if (response.error !== undefined) {
    return <Error />;
  }

  if (songs.value === undefined) {
    return <Loader>Loading artists...</Loader>;
  }

  return (
    <article class="top-artists">
      <h2 class="top-artists-title">Top Artists:</h2>
      <ol class="top-artists-list">
        {songs.value.map((track) => <ArtistCard key={track.id} {...track} />)}
      </ol>
    </article>
  );
}
