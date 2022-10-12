import type { Handler, PageProps } from "$fresh/server.ts";
import type { SearchResult, Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
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
    [endpoints.search(query)]: search ?? undefined,
    [endpoints.charts]: charts ?? undefined,
  });
};

export default function SearchPage({ data }: PageProps<SearchData>) {
  return <MusicBrowser initial={data} />;
}
