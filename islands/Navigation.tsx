export default function Navigation() {
  return (
    <aside class="nav-menu">
      <svg class="nav-icon">
        <title>Logo</title>
        <use href="/logo.svg#logo" />
      </svg>
      <nav class="nav-links">
        <a href="/" class="nav-item">Discover</a>
        {/* <a href="/around-you" class="nav-item">Around You</a> */}
        <a href="/top/artists" class="nav-item">Top Artists</a>
        <a href="/top/songs" class="nav-item">Top Charts</a>
      </nav>
    </aside>
  );
}
