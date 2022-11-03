import type { Handler, PageProps } from "$fresh/server.ts";
import type { Artist, Track } from "@/utils/types.ts";
import { fetchArtist, fetchWorldCharts } from "@shazam";
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
    [`/api/artists/${id}`]: artist ?? undefined,
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function ArtistPage({ url, data }: PageProps<ArtistData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
