import { type ComponentChild, type JSX } from "preact";
import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import classes from "classnames";

import { useRouteSignal } from "@/utils/locationSignal.ts";
import { useWatcher } from "@/utils/signals.ts";

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

function Navigation() {
  return (
    <nav class="nav-menu">
      <svg class="nav-icon" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href={asset("/logo.svg#logo")} />
      </svg>

      <ul class="nav-links">
        <li class="nav-item" title="Discover">
          <NavLink href={"/"}>Discover</NavLink>
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
  readonly children: ComponentChild;
}

function NavLink({ href, children, ...props }: NavLinkProps) {
  const route = useRouteSignal(href ?? "");

  const $class = useWatcher(props.class);
  const $className = useWatcher(props.className);

  const $classes = useComputed(() =>
    classes(
      $class.value,
      $className.value,
      { active: route.isMatch },
    )
  );

  return <a {...props} href={href} class={$classes}>{children}</a>;
}
