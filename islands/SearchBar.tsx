import { useSignal } from "@preact/signals";
import { route } from "preact-router";

export default function SearchBar() {
  const search = useSignal("");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    route(`/search/${search}`);
  };

  const onInput = (event: Event) => {
    const { value = undefined } = event.target as HTMLInputElement;
    if (value !== undefined) {
      search.value = value;
    }
  };

  return (
    <aside>
      <form onSubmit={onSubmit} class="search-bar">
        <label for="search-bar-input" class="search-bar-label">
          Search Music
        </label>
        <div class="search-bar-field">
          <svg class="search-bar-icon">
            <title>Search Icon</title>
            <use href="/search.svg#search" />
          </svg>
          <input
            id="search-bar-input"
            name="search-bar-input"
            class="search-bar-input"
            type="search"
            placeholder="Search"
            autoComplete="off"
            value={search.value}
            onInput={onInput}
          />
        </div>
      </form>
    </aside>
  );
}
