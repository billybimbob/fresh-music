import Router from "preact-router";
import { Link } from "preact-router/match";
import { useComputed, useSignal } from "@preact/signals";
import { asset, IS_BROWSER } from "$fresh/runtime.ts";
import classes from "classnames";

interface NavigationProps {
  url?: string;
}

export default function Navigation({ url }: NavigationProps) {
  const hidden = useSignal(true);

  const $class = useComputed(() =>
    classes({ "side-nav": true, "hidden": hidden.value })
  );

  const title = useComputed(() => hidden.value ? "Show Nav" : "Close Nav");

  const icon = useComputed(() => {
    const svg = hidden.value ? "bars.svg#bars" : "close.svg#close";
    return asset(`/icons/${svg}`);
  });

  const toggle = () => {
    hidden.value = !hidden.value;
  };

  const onRouteChange = () => {
    if (isSmallScreen()) {
      setTimeout(() => hidden.value = true); // timeout might be hacky
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

      <Router
        url={IS_BROWSER ? undefined : url}
        static={!IS_BROWSER}
        onChange={onRouteChange}
      >
        {/* hack to always render the link list */}
        <ul class="links" default>
          <li class="item" title="Discover">
            <Link class="link" activeClassName="active" href="/">
              Discover
            </Link>
          </li>
          <li class="item" title="Top Artists">
            <Link class="link" activeClassName="active" href="/top/artists">
              Top Artists
            </Link>
          </li>
          <li class="item" title="Top Charts">
            <Link class="link" activeClassName="active" href="/top/songs">
              Top Charts
            </Link>
          </li>
        </ul>
      </Router>
    </nav>
  );
}

function isSmallScreen() {
  // kind of hacky, might want to find a better way to auto hide
  return IS_BROWSER && matchMedia("(max-width: 768px)").matches;
}
