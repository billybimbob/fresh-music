import type { ArtistDescription } from "@/utils/types.ts";

export default function ArtistLink({ name, ids }: ArtistDescription) {
  const [artistId = undefined] = ids;

  if (artistId === undefined) {
    return <>{name}</>;
  }

  return <a href={`/artists/${artistId}`}>{name}</a>;
}
