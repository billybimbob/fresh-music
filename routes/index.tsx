import type { Handler, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import * as endpoints from "@/utils/api.ts";
import { fetchGenreCharts, fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface HomeData {
  [key: string]: readonly Track[] | undefined;
}

export const handler: Handler<HomeData> = async (_req, ctx) => {
  const [genreCharts, charts] = await Promise.all([
    fetchGenreCharts(),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [endpoints.defaultGenre]: genreCharts ?? undefined,
    [endpoints.charts]: charts ?? undefined,
  });
};

export default function HomePage({ data }: PageProps<HomeData>) {
  return <MusicBrowser initial={data} />;
}
