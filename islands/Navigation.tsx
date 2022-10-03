export default function Navigation() {
  return (
    <div class="nav-menu">
      <img src="/logo.svg" alt="Logo" class="nav-img" />
      <nav class="nav-links">
        <a href="/" class="nav-item">Discover</a>
        {/* <a href="/around-you" class="nav-item">Around You</a> */}
        <a href="/top-artists" class="nav-item">Top Artists</a>
        <a href="top-charts" class="nav-item">Top Charts</a>
      </nav>
    </div>
  );
}
