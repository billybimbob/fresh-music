import { type Handler, Status } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchSong } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const song = await fetchSong(id);

  if (song === null) {
    return new Response(null, { status: Status.NotFound });
  }

  return Response.json(song, {
    headers: { "content-type": contentType(".json") },
  });
};
