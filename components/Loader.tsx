import { type ComponentChild, isValidElement } from "preact";
import { asset } from "$fresh/runtime.ts";

interface LoaderProps {
  children?: ComponentChild;
}

export default function Loader({ children = "Loading..." }: LoaderProps) {
  return (
    <article class="loader">
      <img
        alt="Loading Animation"
        src={asset("/loader.svg")}
        class="icon"
      />
      {isValidElement(children) ? children : <h1 class="title">{children}</h1>}
    </article>
  );
}
