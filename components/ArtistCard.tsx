import type { Track } from "@/utils/types.ts";

export default function ArtistCard({ name, images, artist }: Track) {
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
