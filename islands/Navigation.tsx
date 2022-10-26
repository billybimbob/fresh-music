import { type ComponentChild, type JSX } from "preact";
import { useComputed, useSignal } from "@preact/signals";
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
  const hidden = useSignal(false);

  const $class = useComputed(() =>
    classes({ "side-nav": true, "hidden": hidden.value })
  );

  const icon = useComputed(() => {
    const svg = hidden.value ? "bars.svg#bars" : "close.svg#close";
    return asset(`/icons/${svg}`);
  });

  const title = useComputed(() => hidden.value ? "Show Nav" : "Close Nav");

  const toggle = () => {
    hidden.value = !hidden.value;
  };

  const onNavClick = () => {
    if (matchMedia("(max-width: 640px)").matches) {
      hidden.value = true;
    }
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
          <NavLink class="link" onClick={onNavClick} href="/">Discover</NavLink>
        </li>
        <li class="item" title="Top Artists">
          <NavLink class="link" onClick={onNavClick} href="/top/artists">
            Top Artists
          </NavLink>
        </li>
        <li class="item" title="Top Charts">
          <NavLink class="link" onClick={onNavClick} href="/top/songs">
            Top Charts
          </NavLink>
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
      { "active": route.isMatch },
    )
  );

  return <a {...props} href={href} class={$classes}>{children}</a>;
}
