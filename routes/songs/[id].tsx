import type { Handler, PageProps } from "$fresh/server.ts";
import { fetchRelatedSongs, fetchSong, fetchWorldCharts } from "@shazam";
import type { Track } from "@/utils/types.ts";
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
    [`/api/songs/${id}`]: details ?? undefined,
    [`/api/songs/related/${id}`]: related ?? [],
    ["/api/charts"]: charts ?? undefined,
  });
};

export default function SongPage({ url, data }: PageProps<SongData>) {
  return <MusicBrowser url={url.pathname} initial={data} />;
}
