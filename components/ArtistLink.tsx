import { useComputed } from "@preact/signals";
import type { ArtistDescription } from "@/utils/types.ts";

export default function ArtistLink({ name, ids }: ArtistDescription) {
  const artistId = useComputed(() => ids.at(0));

  if (artistId.value === undefined) {
    return <>{name}</>;
  }

  return <a href={`/artists/${artistId}`}>{name}</a>;
}
