import { type Handler, Status } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchArtist } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const artist = await fetchArtist(id);

  if (artist === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(artist, {
    headers: { "content-type": contentType(".json") },
  });
};
