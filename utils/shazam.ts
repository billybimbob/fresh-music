import { Status } from "$fresh/server.ts";
// import { IS_BROWSER } from "$fresh/runtime.ts";

// const baseUrl = "https://shazam-core.p.rapidapi.com/v1/";

// const shazamKey = Deno.env.get("SHAZAM_KEY");

// export default function getRequest(
//   endpoint: string,
//   params?: Record<string, string>,
// ) {
//   if (IS_BROWSER) {
//     return Promise.resolve(
//       new Response(null, {
//         status: Status.Unauthorized,
//         statusText: "Cannot request from the browser",
//       }),
//     );
//   }

//   if (shazamKey === undefined) {
//     return Promise.resolve(
//       new Response(null, {
//         status: Status.BadRequest,
//         statusText: "Api key cannot be found",
//       }),
//     );
//   }

//   const url = new URL(endpoint, baseUrl);

//   if (params !== undefined) {
//     for (const [name, value] of Object.entries(params)) {
//       url.searchParams.set(name, value);
//     }
//   }

//   return fetch(url, {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": shazamKey,
//     },
//   });
// }

const RESPONSE_LOC = "./responses";

const responseMap = new Map([
  ["/charts/country", "charts-country.json"],
  ["/charts/genre-world", "charts-genre.json"],
  ["/charts/world", "charts-world.json"],
  ["/search/multi", "multi-search.json"],
  ["/tracks/related", "related-tracks.json"],
  ["/tracks/details", "track.json"],
  ["/artists/details", "artist.json"],
]);

export default async function getRequest(
  endpoint: string,
  _params?: Record<string, string>,
) {
  const fileName = responseMap.get(endpoint);

  if (fileName === undefined) {
    return new Response(null, { status: Status.NotFound });
  }

  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/${fileName}`);

  return Response.json(JSON.parse(contents));
}
