import type { Handler, PageProps } from "$fresh/server.ts";
import type { SearchResult, Track } from "@/utils/types.ts";
import { fetchSearch, fetchWorldCharts } from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface SearchData {
  [key: string]: SearchResult | readonly Track[] | undefined;
}

export const handler: Handler<SearchData> = async (_req, ctx) => {
  const { query } = ctx.params;

  const [search, charts] = await Promise.all([
    fetchSearch(query),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [`/api/search/${query}`]: search ?? undefined,
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function SearchPage({ url, data }: PageProps<SearchData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
