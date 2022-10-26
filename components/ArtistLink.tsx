import type { ArtistDescription } from "@/utils/types.ts";

export default function ArtistLink({ name, ids }: ArtistDescription) {
  const [id = undefined] = ids;

  if (id === undefined) {
    return <p class="artist" title={name}>{name}</p>;
  }

  return (
    <p class="artist" title={name}>
      <a href={`/artists/${id}`}>{name}</a>
    </p>
  );
}
