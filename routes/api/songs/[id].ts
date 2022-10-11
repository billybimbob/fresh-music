import { type Handler, Status } from "$fresh/server.ts";
import { fetchSong } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const song = await fetchSong(id);

  if (song === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(song);
};
