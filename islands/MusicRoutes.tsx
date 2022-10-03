import Router from "preact-router";
import { Discover, Search } from "@/components/pages/mod.ts";

export default function MusicRoutes() {
  return (
    <div class="routes">
      <Router>
        <Discover path="/" />
        <Discover path="/discover/:genre" />
        <Search path="/search/:query" />
      </Router>
    </div>
  );
}
