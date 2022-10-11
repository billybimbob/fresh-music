import type { ArtistDescription } from "@/utils/types.ts";

export default function ArtistLink({ name, ids }: ArtistDescription) {
  const [artistId = undefined] = ids;

  if (artistId === undefined) {
    return <span title={name}>{name}</span>;
  }

  return <a href={`/artists/${artistId}`} title={name}>{name}</a>;
}
