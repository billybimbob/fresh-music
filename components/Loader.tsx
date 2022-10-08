import { ComponentChildren } from "preact";

interface LoaderProps {
  readonly children?: ComponentChildren;
}

export default function Loader({ children }: LoaderProps) {
  return (
    <article class="loader">
      <img alt="Loading Animation" src="/loader.svg" class="loader-icon" />
      <h1 class="loader-title">{children ?? "Loading"}</h1>
    </article>
  );
}
