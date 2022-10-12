import { Link } from "preact-router/match";

export default function Navigation() {
  return (
    <aside class="nav-menu">
      <svg class="nav-icon" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href="/logo.svg#logo" />
      </svg>
      <nav class="nav-links">
        <Link
          title="Discover"
          href="/"
          class="nav-item"
          activeClassName="active"
        >
          Discover
        </Link>
        <Link
          title="Top Artists"
          href="/top/artists"
          class="nav-item"
          activeClassName="active"
        >
          Top Artists
        </Link>
        <Link
          title="Top Charts"
          href="/top/songs"
          class="nav-item"
          activeClassName="active"
        >
          Top Charts
        </Link>
      </nav>
    </aside>
  );
}
