import type { Handler, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import { fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface TopArtistData {
  [key: string]: readonly Track[] | undefined;
}

export const handler: Handler<TopArtistData> = async (_req, ctx) => {
  const charts = await fetchWorldCharts();

  return ctx.render({
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function TopArtistsPage(
  { url, data }: PageProps<TopArtistData>,
) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
