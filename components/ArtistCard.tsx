import type { Track } from "@/utils/types.ts";

type ArtistCardProps = Track;

export default function ArtistCard({ name, images, artist }: ArtistCardProps) {
  const [artistId] = artist.ids;
  return (
    <li class="artist-card">
      <a title={artist.name} href={`/artists/${artistId}`}>
        <img
          class="img"
          alt={`${name} Cover`}
          src={images?.cover}
        />
      </a>
      <p class="name">
        <a title={artist.name} href={`/artists/${artistId}`}>
          {artist.name}
        </a>
      </p>
    </li>
  );
}
