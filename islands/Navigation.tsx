import { Link } from "preact-router/match";

export default function Navigation() {
  return (
    <nav class="nav-menu">
      <svg class="nav-icon" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href="/logo.svg#logo" />
      </svg>
      <ul class="nav-links">
        <li title="Discover" class="nav-item">
          <Link href="/" activeClassName="active">
            Discover
          </Link>
        </li>
        <li title="Top Artists" class="nav-item">
          <Link href="/top/artists" activeClassName="active">
            Top Artists
          </Link>
        </li>
        <li title="Top Charts" class="nav-item">
          <Link href="/top/songs" activeClassName="active">
            Top Charts
          </Link>
        </li>
      </ul>
    </nav>
  );
}
