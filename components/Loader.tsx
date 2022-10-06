import { ComponentChildren } from "preact";

interface LoaderProps {
  readonly children?: ComponentChildren;
}

export default function Loader({ children }: LoaderProps) {
  return (
    <article class="loader">
      <svg class="loader-icon">
        <title>Loading Animation</title>
        <use href="/loader.svg#loader" />
      </svg>
      <h1 class="loader-title">{children ?? "Loading"}</h1>
    </article>
  );
}
