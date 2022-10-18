import { asset } from "$fresh/runtime.ts";

interface PlayButtonProps {
  isActive: boolean;
  title: string;
  onClick?: () => void;
}

export default function PlayButton(
  { isActive, title, onClick }: PlayButtonProps,
) {
  const tabIndex = onClick === undefined ? -1 : 0;

  if (isActive) {
    return (
      <button
        type="button"
        title={`Pause ${title}`}
        class="btn-icon"
        onClick={onClick}
        tabIndex={tabIndex}
      >
        <svg class="play-icon-browse">
          <title>Pause {title}</title>
          <use href={asset("/icons/pause.svg#pause")} />
        </svg>
      </button>
    );
  } else {
    return (
      <button
        type="button"
        title={`Play ${title}`}
        class="btn-icon"
        onClick={onClick}
        tabIndex={tabIndex}
      >
        <svg class="play-icon-browse">
          <title>Play {title}</title>
          <use href={asset("/icons/play.svg#play")} />
        </svg>
      </button>
    );
  }
}
