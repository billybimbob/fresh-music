import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Artist, Track } from "@/utils/types.ts";
import endpoints, { fetchArtist, fetchCharts } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface ArtistData {
  [key: string]: Artist | readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<ArtistData>,
) => {
  const { id } = ctx.params;

  const [artist, charts] = await Promise.all([
    fetchArtist(req, ctx, id),
    fetchCharts(req, ctx),
  ]);

  return ctx.render({
    [endpoints.artist(id)]: artist,
    [endpoints.charts]: charts,
  });
};

export default function ArtistPage({ data }: PageProps<ArtistData>) {
  return <MusicBrowser initial={data} />;
}
