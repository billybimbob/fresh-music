import { type ComponentChild, type JSX } from "preact";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { asset, IS_BROWSER } from "$fresh/runtime.ts";
import classes from "classnames";

import { useLocationSignal, useRouteSignal } from "@/utils/location.ts";
import { useObserver } from "@/utils/observer.ts";

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
  const loc = useLocationSignal();
  const hidden = useSignal(true);

  const $class = useComputed(() =>
    classes({ "side-nav": true, "hidden": hidden.value })
  );

  const title = useComputed(() => hidden.value ? "Show Nav" : "Close Nav");

  const icon = useComputed(() => {
    const svg = hidden.value ? "bars.svg#bars" : "close.svg#close";
    return asset(`/icons/${svg}`);
  });

  useSignalEffect(() => {
    if (loc.value && isSmallScreen()) {
      setTimeout(() => hidden.value = true); // timeout might be hacky
    }
  });

  const toggle = () => {
    hidden.value = !hidden.value;
  };

  return (
    <nav class={$class}>
      <button type="button" title={title} onClick={toggle} class="toggle">
        <svg class="icon">
          <title>{title}</title>
          <use href={icon} />
        </svg>
      </button>
      <svg class="logo" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href={asset("/logo.svg#logo")} />
      </svg>

      <ul class="links">
        <li class="item" title="Discover">
          <NavLink class="link" href="/">Discover</NavLink>
        </li>
        <li class="item" title="Top Artists">
          <NavLink class="link" href="/top/artists">Top Artists</NavLink>
        </li>
        <li class="item" title="Top Charts">
          <NavLink class="link" href="/top/songs">Top Charts</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function isSmallScreen() {
  // kind of hacky, might want to find a better way to auto hide
  return IS_BROWSER && matchMedia("(max-width: 768px)").matches;
}

interface NavLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  readonly children: ComponentChild;
}

function NavLink({ href, children, ...props }: NavLinkProps) {
  const route = useRouteSignal(href ?? "");

  const $class = useObserver(props.class);
  const $className = useObserver(props.className);

  const $classes = useComputed(() =>
    classes(
      $class.value,
      $className.value,
      { "active": route.isMatch },
    )
  );

  return <a {...props} href={href} class={$classes}>{children}</a>;
}
