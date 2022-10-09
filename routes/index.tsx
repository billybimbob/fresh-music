import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints, { fetchCharts, fetchGenreCharts } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface HomeData {
  [key: string]: readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<HomeData>,
) => {
  const [genreCharts, charts] = await Promise.all([
    fetchGenreCharts(req, ctx),
    fetchCharts(req, ctx),
  ]);

  return ctx.render({
    [endpoints.defaultGenre]: genreCharts,
    [endpoints.charts]: charts,
  });
};

export default function HomePage({ data }: PageProps<HomeData>) {
  return <MusicBrowser initial={data} />;
}
