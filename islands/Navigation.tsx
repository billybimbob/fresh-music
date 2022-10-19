import { useEffect, useState } from "preact/hooks";
// import genres from "@/static/genres.json" assert { type: "json" };

import { type ComponentChild, type JSX } from "preact";
import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import classes from "classnames";

import { useRouteSignal } from "@/utils/locationSignal.ts";
import LocationProvider from "@/components/LocationProvider.tsx";

interface NavigationProps {
  readonly url?: string;
}

export default function ({ url }: NavigationProps) {
  return (
    <LocationProvider url={url}>
      <Navigation />
    </LocationProvider>
  );
}

// const [{ value: firstGenre }] = genres;

function Navigation() {
  const [discover] = useState("/");

  // useEffect(() => {
  //   const changeDiscover = () => {
  //     console.log('toggle');
  //     setDiscover(d => d === "/" ? `/discover/${firstGenre}` : "/");
  //   };

  //   const change = setInterval(changeDiscover, 2000);
  //   return () => clearInterval(change);
  // }, []);

  return (
    <nav class="nav-menu">
      <svg class="nav-icon" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href={asset("/logo.svg#logo")} />
      </svg>

      <ul class="nav-links">
        <li class="nav-item" title="Discover">
          <NavLink href={discover}>Discover</NavLink>
        </li>
        <li class="nav-item" title="Top Artists">
          <NavLink href="/top/artists">Top Artists</NavLink>
        </li>
        <li class="nav-item" title="Top Charts">
          <NavLink href="/top/songs">Top Charts</NavLink>
        </li>
      </ul>
    </nav>
  );
}

interface NavLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  readonly class?: JSX.SignalLike<string | undefined>;
  readonly className?: JSX.SignalLike<string | undefined>;
  readonly children: ComponentChild;
}

function NavLink({ href, children, ...props }: NavLinkProps) {
  const route = useRouteSignal(href?.toString() ?? "");

  const className = useComputed(() =>
    classes(
      props.class?.toString(),
      props.className?.toString(),
      { active: route.isMatch },
    )
  );

  return <a {...props} href={href} class={className}>{children}</a>;
}
