import type { Handler, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
import {
  fetchRelatedSongs,
  fetchSong,
  fetchWorldCharts,
} from "@/utils/shazam/mod.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface SongData {
  [key: string]: Track | readonly Track[] | undefined;
}

export const handler: Handler<SongData> = async (_req, ctx) => {
  const { id } = ctx.params;

  const [details, related, charts] = await Promise.all([
    fetchSong(id),
    fetchRelatedSongs(id),
    fetchWorldCharts(),
  ]);

  return ctx.render({
    [endpoints.song(id)]: details ?? undefined,
    [endpoints.related(id)]: related ?? undefined,
    [endpoints.charts]: charts ?? undefined,
  });
};

export default function SongPage({ url, data }: PageProps<SongData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
