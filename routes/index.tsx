import type { HandlerContext, PageProps } from "$fresh/server.ts";

import genres from "@/static/genres.json" assert { type: "json" };
import type { ShazamTrack, Track } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

import MusicBrowser from "@/islands/MusicBrowser.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";

interface PreloadResult {
  charts?: readonly Track[];
  genre?: readonly Track[];
}

const [{ value: defaultGenre }] = genres;

export const handler = async (
  _req: Request,
  ctx: HandlerContext<PreloadResult>,
) => {
  const fetchChart = fetchShazam("/charts/world");

  const fetchGenre = fetchShazam("/charts/genre-world", {
    genre_code: defaultGenre,
  });

  const [charts, genre] = await Promise.all([
    fetchChart.then(getTracks),
    fetchGenre.then(getTracks),
  ]);

  return ctx.render({ charts, genre });
};

async function getTracks(response: Response) {
  if (!response.ok) {
    return undefined;
  }

  const tracks: readonly ShazamTrack[] = await response.json();

  return tracks.map(toTrack);
}

export default function Home(props: PageProps<PreloadResult>) {
  const { charts, genre } = props.data;
  return (
    <main class="music-browser">
      <Navigation />
      <div class="browser-main">
        <SearchBar />
        <MusicBrowser charts={charts} genre={genre} />
      </div>
    </main>
  );
}
