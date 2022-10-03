import { useSignal } from "@preact/signals";
import { route } from "preact-router";

export default function SearchBar() {
  const search = useSignal("");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    route(`/search/${search}`);
  };

  const onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    if (value !== undefined) {
      search.value = value;
    }
  };

  return (
    <form onSubmit={onSubmit} class="search-bar">
      <label for="search-bar-field" class="search-bar-label">
        Search Music
      </label>
      <input
        id="search-bar-field"
        name="search-bar-field"
        class="search-bar-field"
        type="search"
        placeholder="Search"
        autoComplete="off"
        value={search.value}
        onInput={onInput}
      />
    </form>
  );
}
