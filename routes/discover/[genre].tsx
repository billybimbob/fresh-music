import type { Handler, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
import { fetchGenreCharts, fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface DiscoverData {
  [key: string]: readonly Track[] | undefined;
}
export const handler: Handler<DiscoverData> = async (_req, ctx) => {
  const { genre } = ctx.params;

  const [genreCharts, charts] = await Promise.all([
    fetchGenreCharts(genre),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [endpoints.genreCharts(genre)]: genreCharts ?? undefined,
    [endpoints.charts]: charts ?? undefined,
  });
};

export default function DiscoverPage({ url, data }: PageProps<DiscoverData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
