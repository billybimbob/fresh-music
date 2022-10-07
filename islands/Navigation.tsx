import { Link } from "preact-router/match";

export default function Navigation() {
  return (
    <aside class="nav-menu">
      <svg class="nav-icon" viewBox="0 0 220 75">
        <title>Logo</title>
        <use href="/logo.svg#logo" />
      </svg>
      <nav class="nav-links">
        <Link href="/" class="nav-item" activeClassName="active">Discover</Link>
        {/* <Link href="/around-you" class="nav-item">Around You</Link> */}
        <Link href="/top/artists" class="nav-item" activeClassName="active">
          Top Artists
        </Link>
        <Link href="/top/songs" class="nav-item" activeClassName="active">
          Top Charts
        </Link>
      </nav>
    </aside>
  );
}
