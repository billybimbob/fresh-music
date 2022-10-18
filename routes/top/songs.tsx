import type { Handler, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
import { fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface TopSongData {
  [key: string]: readonly Track[] | undefined;
}

export const handler: Handler<TopSongData> = async (_req, ctx) => {
  const charts = await fetchWorldCharts();

  return ctx.render({ [endpoints.charts]: charts ?? undefined });
};

export default function TopSongsPage({ url, data }: PageProps<TopSongData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
