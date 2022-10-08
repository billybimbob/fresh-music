import type { Track } from "@/utils/types.ts";

type ArtistCardProps = Track;

export default function ArtistCard({ name, images, artist }: ArtistCardProps) {
  const [artistId] = artist.ids;
  return (
    <li class="artist-card">
      <img class="artist-card-img" alt={`${name} Cover`} src={images?.cover} />
      <p class="artist-card-name">
        <a href={`/artists/${artistId}`}>{artist.name}</a>
      </p>
    </li>
  );
}
