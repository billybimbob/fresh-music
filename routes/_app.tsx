import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" charSet="utf-8" href="/app.css" />
      </Head>
      <Component />
    </>
  );
}
