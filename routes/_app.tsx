import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Browse Music</title>
        <link rel="stylesheet" charSet="utf-8" href="/app.css" />
      </Head>
      <Component />
    </>
  );
}
