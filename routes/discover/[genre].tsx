import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints, { fetchCharts, fetchGenreCharts } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface DiscoverData {
  [key: string]: readonly Track[] | undefined;
}
export const handler = async (
  req: Request,
  ctx: HandlerContext<DiscoverData>,
) => {
  const { genre } = ctx.params;

  const [genreCharts, charts] = await Promise.all([
    fetchGenreCharts(req, ctx, genre),
    fetchCharts(req, ctx),
  ]);

  return ctx.render({
    [endpoints.genreCharts(genre)]: genreCharts,
    [endpoints.charts]: charts,
  });
};

export default function DiscoverPage({ data }: PageProps<DiscoverData>) {
  return <MusicBrowser initial={data} />;
}
