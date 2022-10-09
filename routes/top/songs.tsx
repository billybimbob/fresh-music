import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints, { fetchCharts } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface TopSongData {
  [key: string]: readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<TopSongData>,
) => {
  const charts = await fetchCharts(req, ctx);

  return ctx.render({ [endpoints.charts]: charts });
};

export default function TopSongsPage({ data }: PageProps<TopSongData>) {
  return <MusicBrowser initial={data} />;
}
