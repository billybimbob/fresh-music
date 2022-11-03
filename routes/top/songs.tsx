import type { Handler, PageProps } from "$fresh/server.ts";
import { fetchWorldCharts } from "@shazam";
import type { Track } from "@/utils/types.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface TopSongData {
  [key: string]: readonly Track[] | undefined;
}

export const handler: Handler<TopSongData> = async (_req, ctx) => {
  const charts = await fetchWorldCharts();

  return ctx.render({
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function TopSongsPage({ url, data }: PageProps<TopSongData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
