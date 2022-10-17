import { ComponentChildren, isValidElement } from "preact";

interface LoaderProps {
  readonly children?: ComponentChildren;
}

export default function Loader({ children = "Loading" }: LoaderProps) {
  return (
    <article class="loader">
      <img alt="Loading Animation" src="/loader.svg" class="loader-icon" />
      {isValidElement(children)
        ? children
        : <h1 class="loader-title">{children}</h1>}
    </article>
  );
}
