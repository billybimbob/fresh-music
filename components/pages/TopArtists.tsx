import { RoutableProps } from "preact-router";
import { useCharts } from "@/utils/client.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopArtists(_props: RoutableProps) {
  const { data: tracks, error } = useCharts();

  if (error !== undefined) {
    return <Error />;
  }

  if (tracks === undefined) {
    return <Loader>Loading artists...</Loader>;
  }

  return (
    <div class="top-artists">
      <h2 class="top-artists-title">Top Artists:</h2>
      <ol class="top-artists-list">
        {tracks.map((track) => <ArtistCard key={track.id} {...track} />)}
      </ol>
    </div>
  );
}
