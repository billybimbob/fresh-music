import type { HandlerContext, PageProps } from "$fresh/server.ts";
import type { Track } from "@/utils/types.ts";
import endpoints, { fetchRelated, fetchSong } from "@/utils/api.ts";
import MusicBrowser from "@/components/MusicBrowser.tsx";

interface SongData {
  [key: string]: Track | readonly Track[] | undefined;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext<SongData>,
) => {
  const { id } = ctx.params;

  const [details, related] = await Promise.all([
    fetchSong(req, ctx, id),
    fetchRelated(req, ctx, id),
  ]);

  return ctx.render({
    [endpoints.song(id)]: details,
    [endpoints.related(id)]: related,
  });
};

export default function SongPage({ data }: PageProps<SongData>) {
  return <MusicBrowser initial={data} />;
}
