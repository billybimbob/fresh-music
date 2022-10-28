import { AppProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Browse Music</title>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="utf-8"
          href={asset("/app.css")}
        />
        <link rel="icon" href={asset("/favicon.ico")} type="image/x-icon" />
      </Head>
      <Component />
    </>
  );
}
