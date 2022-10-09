import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints, { fetchCharts } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface TopArtistData {
  [key: string]: readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<TopArtistData>,
) => {
  const charts = await fetchCharts(req, ctx);

  return ctx.render({ [endpoints.charts]: charts });
};

export default function TopArtistsPage({ data }: PageProps<TopArtistData>) {
  return <MusicBrowser initial={data} />;
}
