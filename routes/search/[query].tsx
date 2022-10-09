import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { SearchResult, Track } from "@/utils/types.ts";
import endpoints, { fetchCharts, fetchSearch } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface SearchData {
  [key: string]: SearchResult | readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<SearchData>,
) => {
  const { query } = ctx.params;

  const [search, charts] = await Promise.all([
    fetchSearch(req, ctx, query),
    fetchCharts(req, ctx),
  ]);

  return ctx.render({
    [endpoints.search(query)]: search,
    [endpoints.charts]: charts,
  });
};

export default function SearchPage({ data }: PageProps<SearchData>) {
  return <MusicBrowser initial={data} />;
}
