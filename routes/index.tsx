import type { Handler, PageProps } from "$fresh/server.ts";
import { fetchGenreCharts, fetchWorldCharts } from "@shazam";

import genres from "@/static/genres.json" assert { type: "json" };
import type { Track } from "@/utils/types.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

const [{ value: firstGenre }] = genres;

interface HomeData {
  [key: string]: readonly Track[] | undefined;
}

export const handler: Handler<HomeData> = async (_req, ctx) => {
  const [genreCharts, charts] = await Promise.all([
    fetchGenreCharts(),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [`/api/charts/genres/${firstGenre}`]: genreCharts ?? undefined,
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function HomePage({ url, data }: PageProps<HomeData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
