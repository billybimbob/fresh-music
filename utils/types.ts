export interface ShazamCity {
  readonly name: string;
  readonly listid: string;
}

export interface ShazamCountry {
  readonly name: string;
  readonly listid: string;
  readonly cities: readonly ShazamCity[];
}

export interface ShazamGenre {
  readonly name: string;
  readonly listid: string;
  readonly count: number;
}

export interface ShazamCharts {
  readonly countries: readonly ShazamCountry[];
  readonly global: {
    readonly genres: readonly ShazamGenre[];
  };
}

export interface ShazamTrack {
  readonly key: string;
  readonly title: string;
  readonly subtitle: string;
  readonly hub: {
    readonly actions: readonly {
      readonly type: string;
      readonly id?: string;
      readonly uri?: string;
    }[];
  };
  readonly images: {
    readonly background: string;
    readonly coverart: string;
  };
  readonly genres: { [key: string]: string };
  readonly sections?: readonly { readonly text?: readonly string[] }[];
}

export interface ShazamArtistPreview {
  readonly avatar: string;
  readonly id: string;
  readonly verified: boolean;
  readonly adamid: string;
}

export interface ShazamSearch {
  readonly tracks: {
    readonly hits: readonly { track: ShazamTrack }[];
  };
  readonly artists: {
    readonly hits: readonly { artist: ShazamArtistPreview }[];
  };
}

interface ShazamArtwork {
  readonly url: string;
  readonly textColor1: string;
  readonly textColor2: string;
  readonly textColor3: string;
  readonly textColor4: string;
  readonly bgColor: string;
}

export interface ShazamArtist {
  readonly artists: {
    readonly [id: string]: {
      readonly id: string;
      readonly attributes: {
        readonly genreNames: readonly string[];
        readonly name: string;
        readonly artwork: ShazamArtwork;
      };
      readonly views: {
        readonly "top-songs": {
          readonly data: readonly { id: string }[];
        };
      };
    };
  };
  // TODO: include albums def
  readonly songs: {
    readonly [id: string]: {
      readonly id: string;
      readonly attributes: {
        readonly albumName: string;
        readonly genreNames: readonly string[];
        readonly releaseDate: string;
        readonly durationInMillis: number;
        readonly artwork: ShazamArtwork;
        readonly composerName: string;
        readonly artistName: string;
        readonly name: string;
        readonly previews: readonly { readonly url: string }[];
      };
    };
  };
}

export interface Track {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly genres: readonly string[];
  readonly images: {
    readonly background: string;
    readonly cover: string;
  };
  readonly data?: string;
  readonly lyrics?: string;
}

export interface Artist {
  readonly id: string;
  readonly genres: readonly string[];
  readonly name: string;
  readonly artwork: Artwork;
  readonly topSongs: readonly ArtistSong[];
  readonly songs: readonly ArtistSong[];
}

interface ArtistSong {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly genres: readonly string[];
  readonly album: string;
  readonly releaseDate: string;
  readonly duration: number;
  readonly artwork: Artwork;
  readonly composer: string;
  readonly data?: string;
}

interface Artwork {
  readonly url: string;
  readonly colors: {
    readonly text: readonly string[];
    readonly background: string;
  };
}

export type Song = Track | ArtistSong;

export function toTrack(source: ShazamTrack): Track {
  return {
    id: source.key,
    name: source.title,
    artist: source.subtitle,
    genres: Object.values(source.genres),
    images: {
      background: source.images.background,
      cover: source.images.coverart,
    },
    data: source.hub.actions.find((a) => a.type === "uri")?.uri,
    lyrics: source.sections?.find(({ text }) => Boolean(text))?.text?.join(""),
  };
}

export function toArtist(source: ShazamArtist): Artist {
  const [artist] = Object.values(source.artists);

  const songs = Object
    .values(source.songs)
    .reduce(
      (ss, song) => ss.set(song.id, toArtistSong(song)),
      new Map<string, ArtistSong>(),
    );

  const topSongs = artist.views["top-songs"].data
    .map(({ id }) => id)
    .filter(songs.has)
    .map((id) => songs.get(id)!);

  return {
    id: artist.id,
    genres: artist.attributes.genreNames,
    name: artist.attributes.name,
    artwork: toArtwork(artist.attributes.artwork),
    topSongs,
    songs: [...songs.values()],
  };
}

function toArtwork(source: ShazamArtwork): Artwork {
  return {
    url: source.url,
    colors: {
      text: [
        source.textColor1,
        source.textColor2,
        source.textColor3,
        source.textColor4,
      ],
      background: source.bgColor,
    },
  };
}

function toArtistSong(source: ShazamArtist["songs"]["id"]): ArtistSong {
  const { id, attributes } = source;
  const { previews: [pre = undefined] } = attributes;
  return {
    id,
    album: attributes.albumName,
    genres: attributes.genreNames,
    releaseDate: attributes.releaseDate,
    duration: attributes.durationInMillis,
    artwork: toArtwork(attributes.artwork),
    composer: attributes.composerName,
    artist: attributes.artistName,
    name: attributes.name,
    data: pre?.url,
  };
}

export function addSize(src: string, size: number) {
  return src.replace(/({w})|({h})/, size.toString());
}
