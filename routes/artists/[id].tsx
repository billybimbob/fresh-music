import type { Handler, PageProps } from "$fresh/server.ts";
import type { Artist, Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
import { fetchArtist, fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface ArtistData {
  [key: string]: Artist | readonly Track[] | undefined;
}

export const handler: Handler<ArtistData> = async (_req, ctx) => {
  const { id } = ctx.params;

  const [artist, charts] = await Promise.all([
    fetchArtist(id),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [endpoints.artist(id)]: artist ?? undefined,
    [endpoints.charts]: charts ?? undefined,
  });
};

export default function ArtistPage({ data }: PageProps<ArtistData>) {
  return <MusicBrowser initial={data} />;
}
