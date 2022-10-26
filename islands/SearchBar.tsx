import { batch, useComputed, useSignal } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useLocationSignal } from "@/utils/locationSignal.ts";
import LocationProvider from "@/components/LocationProvider.tsx";

interface SearchBarProps {
  readonly url?: string;
}

export default function ({ url }: SearchBarProps) {
  return (
    <LocationProvider url={url}>
      <SearchBar />
    </LocationProvider>
  );
}

function SearchBar() {
  const loc = useLocationSignal();
  const search = useSignal("");
  const isEmpty = useComputed(() => search.value === "");

  const onSubmit = (event: Event) => {
    event.preventDefault();
    if (isEmpty.value) return;

    batch(() => {
      loc.value = `/search/${search}`;
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
    // <article class="search-music">
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
        class="input"
        type="search"
        placeholder="Search"
        autoComplete="off"
        value={search}
        onInput={onInput}
      />
    </form>
    // </article>
  );
}
