import { type ComponentChild } from "preact";
import { asset } from "$fresh/runtime.ts";
import { useRoute } from "wouter";
import classes from "classnames";
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
          <NavLink href="/">Discover</NavLink>
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

interface NavLinkProps {
  readonly href: string;
  readonly children: ComponentChild;
}

function NavLink({ href, children }: NavLinkProps) {
  const [isActive] = useRoute(href);
  const className = classes({ active: isActive });

  return <a href={href} class={className}>{children}</a>;
}
