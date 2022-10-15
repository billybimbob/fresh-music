import { route } from "preact-router";
import { useComputed, useSignal } from "@preact/signals";

export default function SearchBar() {
  const search = useSignal("");
  const isEmpty = useComputed(() => search.value === "");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    if (search.value !== "") {
      route(`/search/${search}`);
      search.value = "";
    }
  };

  const onInput = (event: Event) => {
    const { value = undefined } = event.target as HTMLInputElement;
    if (value !== undefined) {
      search.value = value;
    }
  };

  return (
    <form class="search-bar" onSubmit={onSubmit}>
      <button
        title="Search Music"
        type="submit"
        class="btn-icon"
        disabled={isEmpty.value}
      >
        <svg class="search-bar-icon">
          <title>Search Music</title>
          <use href="/icons/search.svg#search" />
        </svg>
      </button>
      <input
        title="Search Music"
        id="search-bar-input"
        name="search-bar-input"
        required
        class="search-bar-input"
        type="search"
        placeholder="Search"
        autoComplete="off"
        value={search.value}
        onInput={onInput}
      />
    </form>
  );
}
