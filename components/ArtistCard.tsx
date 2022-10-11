import type { Track } from "@/utils/types.ts";

type ArtistCardProps = Track;

export default function ArtistCard({ name, images, artist }: ArtistCardProps) {
  const [artistId] = artist.ids;
  return (
    <li class="artist-card">
      <a href={`/artists/${artistId}`}>
        <img
          class="artist-card-img"
          alt={`${name} Cover`}
          src={images?.cover}
        />
      </a>
      <p class="artist-card-name">
        <a href={`/artists/${artistId}`} title={artist.name}>
          {artist.name}
        </a>
      </p>
    </li>
  );
}
