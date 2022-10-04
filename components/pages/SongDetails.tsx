import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";

import { type Track } from "@/utils/types.ts";
import { useRelatedSongs, useSongDetails } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SongDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function SongDetails({ id = "" }: SongDetailsProps) {
  const { data: track, error: songError } = useSongDetails(id);
  const { data: related, error: relatedError } = useRelatedSongs(id);

  const onSongClick = (song: Track) => {
    if (related === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songIndex = related.indexOf(song);
    const songSlice = related.slice(songIndex);

    queue.listenTo(...songSlice);
  };

  if (songError || relatedError) {
    return <Error />;
  }

  if (track === undefined || related === undefined) {
    return <Loader>Searching song details...</Loader>;
  }

  return (
    <div class="song-page">
    </div>
  );
}
