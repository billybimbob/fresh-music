import { ComponentChildren } from "preact";

interface LoaderProps {
  readonly children?: ComponentChildren;
}

export default function Loader({ children }: LoaderProps) {
  return (
    <div class="loader">
      <img src="/loader.svg" class="loader-img" />
      <h1 class="loader-title">{children ?? "Loading"}</h1>
    </div>
  );
}
