import { batch, useComputed, useSignal } from "@preact/signals";
import { route } from "preact-router";
import { asset } from "$fresh/runtime.ts";

export default function SearchBar() {
  const search = useSignal("");
  const isEmpty = useComputed(() => search.value === "");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    if (isEmpty.value) return;

    batch(() => {
      route(`/search/${search}`);
      search.value = "";
    });
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
        disabled={isEmpty}
      >
        <svg class="icon">
          <title>Search Music</title>
          <use href={asset("/icons/search.svg#search")} />
        </svg>
      </button>
      <input
        title="Search Music"
        name="query"
        required
        id="search-music"
        class="input"
        type="search"
        placeholder="Search"
        autoComplete="off"
        value={search}
        onInput={onInput}
      />
    </form>
  );
}
