import { useComputed } from "@preact/signals";
import { useCharts } from "@/utils/client.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopArtists() {
  const response = useCharts();
  const tracks = useComputed(() => response.data);

  if (response.error) {
    return <Error />;
  }

  if (tracks.value === undefined) {
    return <Loader>Loading artists...</Loader>;
  }

  return (
    <article class="top-artists">
      <h2 class="top-artists-title">Top Artists</h2>
      <ol class="top-artists-list">
        {tracks.value.map((track) => <ArtistCard key={track.id} {...track} />)}
      </ol>
    </article>
  );
}
